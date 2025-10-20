import { type ContentItem, PricingOption } from "../types";

interface ContentCardProps {
  item: ContentItem;
}

export default function ContentCard({ item }: ContentCardProps) {
  const getPricingDisplay = () => {
    if (item.pricingOption === PricingOption.Paid && item.price !== undefined) {
      return (
        <span className="text-white font-medium text-lg">
          ${item.price.toFixed(2)}
        </span>
      );
    }
    if (item.pricingOption === PricingOption.Free) {
      return (
        <span className="text-white font-medium text-sm uppercase">FREE</span>
      );
    }
    if (item.pricingOption === PricingOption.ViewOnly) {
      return (
        <span className="text-white font-medium text-sm uppercase">
          View Only
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#1a1f2e] rounded overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all duration-200 group h-full flex flex-col">
      <div className="aspect-square bg-gray-800 overflow-hidden flex items-center justify-center">
        <img
          src={item.imagePath || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-full object-fit group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-normal text-white text-sm mb-1">{item.title}</h3>
          <p className="text-xs text-gray-400">{item.userName}</p>
        </div>

        <div className="mt-3 text-right">{getPricingDisplay()}</div>
      </div>
    </div>
  );
}
