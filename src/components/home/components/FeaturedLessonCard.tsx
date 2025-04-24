import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HashLink } from 'react-router-hash-link';

interface FeaturedLesson {
  id: string;
  imageSrc: string;
  title: string;
  description: string;
}

interface FeaturedLessonCardProps {
  lesson: FeaturedLesson;
}

const FeaturedLessonCard: React.FC<FeaturedLessonCardProps> = ({ lesson }) => {
  return (
    <Card
      key={lesson.id}
      className="shrink-0 transform transition-transform hover:scale-105 hover:shadow-lg duration-300 group"
    >
      <CardContent className="flex flex-col h-full">
        <img
          src={lesson.imageSrc}
          alt={lesson.title}
          className="rounded-md mb-2 aspect-video w-full object-cover h-48"
          aria-label={lesson.title}
        />
        <h3 className="text-2xl font-semibold mb-2 group-hover:text-teal-500 transition-colors duration-300">
          {lesson.title}
        </h3>
        <p className="text-gray-600 text-lg group-hover:text-gray-800 transition-colors duration-300">
          {lesson.description}
        </p>
        <Button asChild className="mt-auto">
          <HashLink to={`/lessons/${lesson.id}#top`} smooth={true} duration={500}>
            Ver lección
          </HashLink>
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeaturedLessonCard;
