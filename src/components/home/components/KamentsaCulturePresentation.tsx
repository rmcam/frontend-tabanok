import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HashLink } from 'react-router-hash-link';

const KamentsaCulturePresentation = () => {
  return (
    <Card className="w-full py-12">
      <CardContent className="text-center">
        <h2 className="text-3xl font-bold mb-6">Sumérgete en el Universo Kamëntsá</h2>
        <p className="text-lg mb-8">
          Descubre la riqueza ancestral de la cultura Kamëntsá, un legado de sabiduría, arte y conexión con la naturaleza. Explora sus tradiciones, su lengua y su gente, y déjate cautivar por la magia de este universo único.
        </p>
        <div className="mb-8">
          <p className="italic text-gray-500">
            "La cultura Kamëntsá es el corazón de nuestra identidad, la fuerza que nos une y el legado que transmitimos a las futuras generaciones." - Abuela Kamëntsá
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-x-4 sm:space-y-0">
          <Button asChild>
            <HashLink to="/lessons#top" smooth={true} duration={500}>
              Lecciones de Kamëntsá
            </HashLink>
          </Button>
          <Button asChild>
            <HashLink to="/dictionary" smooth={true} duration={500}>
              Diccionario Kamëntsá
            </HashLink>
          </Button>
          <Button asChild>
            <HashLink to="/events" smooth={true} duration={500}>
              Eventos culturales
            </HashLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KamentsaCulturePresentation;