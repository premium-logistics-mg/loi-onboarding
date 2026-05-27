import { userProfile } from '@/lib/data'

export function UserProfile() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-[#0B2540] flex items-center justify-center">
          <span className="text-3xl font-semibold text-[#F5F1E8]">
            {userProfile.name.charAt(0)}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-[#0B2540]">
            {userProfile.name}
          </h2>
          <p className="text-sm text-[#4A5568]">
            {userProfile.role} - {userProfile.entreprise}
          </p>
          <p className="text-xs text-[#4A5568]">{userProfile.location}</p>
        </div>
      </div>

      {/* Fonctions */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#0B2540] uppercase tracking-wide">
          Fonctions
        </h3>
        <div className="flex flex-wrap gap-2">
          {userProfile.fonctions.map((fonction, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-[#1A8E7E]/10 text-[#1A8E7E] text-sm rounded-md border border-[#1A8E7E]/20"
            >
              {fonction}
            </span>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="p-4 bg-[#EBE6DB] rounded-lg border border-[#D4CFC4]">
        <p className="text-xs text-[#4A5568] leading-relaxed">
          Ce workspace centralise votre file de demandes (DDV) taguée par fonction. 
          Les montants, SLA et autres données quantitatives affichent 
          <span className="font-mono mx-1 text-[#D97706]">À CONFIRMER</span>
          tant que les valeurs réelles ne sont pas fournies.
        </p>
      </div>
    </div>
  )
}
