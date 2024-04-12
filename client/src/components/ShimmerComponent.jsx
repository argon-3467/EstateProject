import { ShimmerPostItem } from "react-shimmer-effects";

export default function ShimmerComponent({ size }) {
  const arr = new Array(size).fill(1);
  return (
    <div className="flex flex-wrap gap-4">
      {arr.map((value, index) => (
        <div
          key={index}
          className="bg-white shadow-md hover:shadow-lg transition-shadow 
                overflow-hidden rounded-lg w-full sm:w-[300px] 
                "
        >
          <ShimmerPostItem card title text cta />
        </div>
      ))}
    </div>
  );
}
