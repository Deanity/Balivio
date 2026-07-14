import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export function DestinationCard({
  name,
  tagline,
  image,
  villas,
}: {
  name: string;
  tagline: string;
  image: string;
  villas: number;
}) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: isLoggedIn ? "/search" : "/login", search: isLoggedIn ? { location: name } : undefined });
  };

  return (
    <button
      onClick={handleClick}
      className="group relative block h-64 w-full overflow-hidden rounded-3xl shadow-card sm:h-72"
    >
      <img
        src={image}
        alt={name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{tagline}</p>
        <h3 className="mt-1 text-2xl font-bold">{name}</h3>
        <p className="mt-1 text-xs opacity-90">{villas} villa tersedia</p>
      </div>
    </button>
  );
}