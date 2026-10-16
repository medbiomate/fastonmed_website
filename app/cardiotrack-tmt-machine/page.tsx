import CardiologyProductPage, { cardiologyMetadata } from '@/components/CardiologyProductPage';

export const metadata = cardiologyMetadata('cardiotrack-tmt-machine');

export default function Page() {
  return <CardiologyProductPage slug="cardiotrack-tmt-machine" />;
}
