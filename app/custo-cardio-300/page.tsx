import CardiologyProductPage, { cardiologyMetadata } from '@/components/CardiologyProductPage';

export const metadata = cardiologyMetadata('custo-cardio-300');

export default function Page() {
  return <CardiologyProductPage slug="custo-cardio-300" />;
}
