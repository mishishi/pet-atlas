/**
 * FeaturedBreeds · 主页精选区
 */
import { Container } from "../ui/Container";
import { BreedCard } from "./BreedCard";
import { getAllPets } from "@/lib/pets";

export function FeaturedBreeds() {
  const pets = getAllPets().slice(0, 4);

  return (
    <section id="featured" className="py-20 md:py-28 bg-oat-300/40">
      <Container size="xl">
        <div className="mb-12">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-brick mb-3 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-brick" />
            Featured · 本月精选
          </div>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-brown-900 tracking-tight max-w-[20ch]">
              标本柜一角
            </h2>
            <p className="text-brown-600 max-w-md">
              从 50 张图谱中挑出 4 张,先睹为快。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {pets.map((pet) => (
            <BreedCard key={pet.slug} pet={pet} size="md" />
          ))}
        </div>
      </Container>
    </section>
  );
}
