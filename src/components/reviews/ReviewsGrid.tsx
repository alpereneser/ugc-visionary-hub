import { ReviewCard } from "./ReviewCard";

const reviews = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    review: "Tracefluence transformed how we manage our UGC campaigns. The insights are invaluable!"
  },
  {
    name: "Mike Chen",
    role: "Brand Manager",
    review: "The analytics and tracking features have helped us optimize our creator partnerships."
  },
  {
    name: "Emma Davis",
    role: "Content Strategist",
    review: "Finally, a platform that makes managing multiple creators and campaigns effortless."
  }
];

export const ReviewsGrid = () => {
  return (
    <div className="max-w-4xl mx-auto my-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {reviews.map((review, index) => (
          <ReviewCard
            key={index}
            {...review}
            delay={index * 200}
          />
        ))}
      </div>
    </div>
  );
};