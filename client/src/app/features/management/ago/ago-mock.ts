import { AgoUser, VoyagePointType } from './models';

export const agoUser: AgoUser = {
  voyages: [
    {
      id: '0',
      name: 'COVID-19',
      display: { img: 'biohazard.png', color: 'red', slotIndex: 0 },
      finished: false,
      voyagePoints: [
        {
          id: '000',
          type: VoyagePointType.START,
          date: new Date('2022-01-01'),
          pos: '2022_N01_W00_S00',
          message: 'COVID-19 on this day started affecting my life.',
        },
        {
          id: '002',
          type: VoyagePointType.NOTE,
          date: new Date('2022-05-05'),
          pos: '2022_N05_W00_S00',
          message: 'Lockdown has ended',
          display: { size: 'big' },
        },
        {
          id: '003',
          type: VoyagePointType.NOTE,
          date: new Date('2024-10-10'),
          pos: '2024_N10_W00_S00',
          message: 'Virus stopped affecting my life that much.',
          display: { img: 'smiling-face.png' },
        },
      ],
    },
    {
      id: '10',
      name: 'COVID-19',
      display: { img: 'biohazard.png', color: 'green', slotIndex: 1 },
      finished: true,
      voyagePoints: [
        {
          id: '100',
          type: VoyagePointType.START,
          date: new Date('2024-01-01'),
          pos: '2024_N01_W00_S01',
          message: 'COVID-19 on this day started affecting my life.',
        },
        {
          id: '102',
          type: VoyagePointType.END,
          date: new Date('2024-05-01'),
          pos: '2024_N05_W00_S01',
          message: 'Lockdown has ended',
          display: { size: 'big' },
        },
      ],
    },
  ],
};
