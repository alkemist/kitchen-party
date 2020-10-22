import {MeasureTypeEnum, MeasureUnitEnum} from '../enums/measureType';

export const MeasureTypeLabels = [
  {value: MeasureTypeEnum.quantity, label: 'Quantité'},
  {value: MeasureTypeEnum.time, label: 'Durée'},
  {value: MeasureTypeEnum.mass, label: 'Masse'},
  {value: MeasureTypeEnum.dimension, label: 'Dimension'},
  {value: MeasureTypeEnum.volume, label: 'Volume'},
  {value: MeasureTypeEnum.temperature, label: 'Température'},
];

export const MeasureUnitLabels = [
  {value: MeasureUnitEnum.number, label: '', short: ''},
  {value: MeasureUnitEnum.minute, label: 'minute', short: 'min'},
  {value: MeasureUnitEnum.gram, label: 'gramme', short: 'g'},
  {value: MeasureUnitEnum.meter, label: 'mètre', short: 'm'},
  {value: MeasureUnitEnum.liter, label: 'litre', short: 'l'},
  {value: MeasureUnitEnum.degree, label: 'degré', short: '°C'},
];
