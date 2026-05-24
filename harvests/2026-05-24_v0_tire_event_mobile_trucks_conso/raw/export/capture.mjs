// Captures Playwright du flux pneu D82 (light + dark) à 375×812.
// Usage : node capture.mjs  (l'app buildée doit tourner sur http://localhost:3100)
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const BASE = 'http://localhost:3100'
const OUT = new URL(
  '../../captures/',
  import.meta.url
)
const outDir = decodeURIComponent(OUT.pathname.replace(/^\/([A-Za-z]:)/, '$1'))
mkdirSync(outDir, { recursive: true })

const VIEWPORT = { width: 375, height: 812 }

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    const html = document.documentElement
    if (t === 'dark') html.classList.add('dark')
    else html.classList.remove('dark')
  }, theme)
}

async function shot(page, name) {
  const file = `${outDir}/${name}.png`
  await page.screenshot({ path: file })
  console.log('saved', file)
}

async function runFlow(browser, theme) {
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 })
  const page = await ctx.newPage()

  // Repartir propre (pas de pending events persistés)
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.clear())
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await setTheme(page, theme)
  await page.waitForTimeout(300)

  // 01 · écran type d'événement (entrée)
  await shot(page, `01-event-type-${theme}`)

  // Choisir "Montage"
  await page.getByRole('button', { name: /Montage/ }).click()
  await page.waitForTimeout(250)
  await shot(page, `02-vehicle-${theme}`)

  // Choisir le camion PNE-001
  await page.getByRole('button', { name: /PNE-001/ }).click()
  await page.waitForTimeout(250)
  await shot(page, `03-position-${theme}`)

  // Choisir une position (DIR 1ESS-G)
  await page.getByRole('button', { name: 'DIR 1ESS-G' }).first().click()
  await page.waitForTimeout(150)
  await page.getByRole('button', { name: 'Continuer' }).click()
  await page.waitForTimeout(250)
  await shot(page, `04-details-${theme}`)

  // Remplir les détails
  await page.getByRole('button', { name: 'ONYX' }).click()
  await page.getByPlaceholder('Saisir le numéro…').fill('SN-DEMO-001')
  await page.getByRole('button', { name: '315/80R22,5' }).click()
  await page.getByPlaceholder('82000').fill('82000')
  await page.waitForTimeout(150)
  await shot(page, `05-details-filled-${theme}`)

  // Vérifier
  await page.getByRole('button', { name: 'Vérifier' }).click()
  await page.waitForTimeout(250)
  await shot(page, `06-confirmation-${theme}`)

  // Signer + enregistrer
  await page.getByRole('button', { name: /Je confirme/ }).click()
  await page.waitForTimeout(150)
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await page.waitForTimeout(300)
  await shot(page, `07-success-${theme}`)

  await ctx.close()
}

const browser = await chromium.launch()
try {
  await runFlow(browser, 'dark')
  await runFlow(browser, 'light')
} finally {
  await browser.close()
}
console.log('done')
