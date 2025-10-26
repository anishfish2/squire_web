export default function MobileHeader() {
  return (
          <header className="fixed top-0 left-0 w-full bg-black/90 backdrop-blur-sm flex items-center justify-between px-5 py-3 z-[100] border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src="/textures/Squire.png"
              alt="Squire Logo"
              className="w-8 h-8 object-contain invert brightness-200"
            />
            <span className="text-white font-semibold text-lg tracking-tight">Squire</span>
          </div>
        </header>
  )
}
