import { InputNumber, Select } from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

export type CapacityUnit = 'Mi' | 'M' | 'Gi' | 'G';

export interface IUnitValue {
  number?: number;
  unit?: CapacityUnit;
}

interface CapacityInputProps {
  value?: IUnitValue;
  onChange?: (value: IUnitValue) => void;
}

const CapacityInput: React.FC<CapacityInputProps> = ({ value = {}, onChange }) => {
  const [number, setNumber] = useState<number>();
  const [unit, setUnit] = useState<CapacityUnit>('Gi');

  const triggerChange = (changedValue: { number?: number; unit?: CapacityUnit }) => {
    onChange?.({ number, unit, ...value, ...changedValue });
  };

  const onNumberChange = (value: number) => {
    setNumber(value);
    triggerChange({ number: value });
  };

  const onUnitChange = (newUnit: CapacityUnit) => {
    if (!('unit' in value)) {
      setUnit(newUnit);
    }
    triggerChange({ unit: newUnit });
  };

  return (
    <span>
      <InputNumber value={value.number || number} onChange={onNumberChange} style={{ width: 'calc(100% - 88px)' }} />
      <Select value={value.unit || unit} style={{ width: 80, margin: '0 0 0 8px' }} onChange={onUnitChange}>
        <Option value="Mi">Mi</Option>
        <Option value="M">M</Option>
        <Option value="Gi">Gi</Option>
        <Option value="G">G</Option>
      </Select>
    </span>
  );
};

export default CapacityInput;
