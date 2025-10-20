import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="bg-[#0f1419] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-wider">
              CONNECT
            </h1>
          </div>
        </div>

        <div className="pb-6 pt-4">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
