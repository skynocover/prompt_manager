import React, { useCallback } from 'react';
import { Input } from 'antd';
import { useProject } from '../domains/project';
import { TestChat } from '../modals/TestChat';

interface parameter {
  name: string;
  value: string;
}

const extractSubstrings = (s: string): string[] => {
  const regex = /{([^}]+)}/g;
  const result: string[] = [];
  let match;
  while ((match = regex.exec(s)) !== null) {
    result.push(match[1]);
  }
  return result;
};

export const SystemParameters = ({
  preSystem,
  system,
  setSystem,
}: {
  preSystem: string;
  system: string;
  setSystem: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [parameters, setParameters] = React.useState<parameter[]>([]);
  const { project, makeSystemByTemplate } = useProject();

  React.useEffect(() => {
    const result = extractSubstrings(preSystem);
    setParameters(
      result.map((r) => {
        return { name: r, value: '' };
      }),
    );
  }, [preSystem]);

  const makeSystem = useCallback(async () => {
    const temp: { [key: string]: string } = {};
    parameters.forEach((param) => {
      temp[param.name] = param.value;
    });
    const v = await makeSystemByTemplate({ prompt: preSystem, variable: temp });
    setSystem(v);
  }, [preSystem, parameters, makeSystemByTemplate, setSystem]);

  React.useEffect(() => {
    makeSystem();
  }, [makeSystem]);

  const handleParameterChange = useCallback((index: number, value: string) => {
    setParameters((prev) => {
      const temp = [...prev];
      temp[index] = { name: temp[index].name, value };
      return temp;
    });
  }, []);

  return (
    <>
      <div className="flex items-center font-bold">參數</div>
      <div className="">
        {parameters.map((para, index) => (
          <div className="flex items-center mt-2 space-x-2 border-black border-3">
            <label htmlFor="variableName" className="text-gray-700">
              {para.name}:
            </label>
            <Input
              value={para.value}
              onChange={(e) => handleParameterChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="mt-2">
        <Input.TextArea rows={6} value={system} className="w-full mb-2" />
        <div className="flex justify-end">
          <TestChat system={system ? system : project?.system || ''} />
        </div>
      </div>
    </>
  );
};
