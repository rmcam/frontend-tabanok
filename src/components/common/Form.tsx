import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FormProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onSubmit: () => void;
  onCancel?: () => void;
}

const Form = ({ title, description, children, onSubmit, onCancel }: FormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {children}
      </CardContent>
      <CardFooter className="flex justify-end">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button onClick={onSubmit}>Guardar</Button>
      </CardFooter>
    </Card>
  );
};

export default Form;
