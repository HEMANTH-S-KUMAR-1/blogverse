export default function AdSenseSlot({ size = 'rectangle' }) {
  const sizeClasses = {
    leaderboard: 'h-[90px] w-full max-w-[728px] mx-auto',
    rectangle: 'h-[250px] w-full max-w-[300px]',
    article: 'h-[280px] w-full max-w-[336px] mx-auto',
  }

  return (
    <div
      className={`adsense-slot ${sizeClasses[size] || sizeClasses.rectangle}`}
      data-slot={size}
    >
      <span className="text-xs">Advertisement</span>
    </div>
  )
}
