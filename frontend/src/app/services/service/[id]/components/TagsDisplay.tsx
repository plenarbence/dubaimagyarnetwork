type TagsDisplayProps = {
  tags: string[] | null;
  max?: number;
};

export function TagsDisplay({ tags, max = 20 }: TagsDisplayProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div
      className="flex flex-wrap gap-1 mt-2 overflow-hidden"
      style={{ maxHeight: "3rem" }}
    >
      {tags.slice(0, max).map((tag, idx) => (
        <span
          key={idx}
          className="bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
