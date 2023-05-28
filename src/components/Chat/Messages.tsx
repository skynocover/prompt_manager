import React from 'react';
import ReactMarkdown from 'react-markdown';
import ReactECharts from 'echarts-for-react';

import { BaseChatMessage } from 'langchain/schema';
import { getOption } from '../../utils/echarts';

export const Messages = ({
  messages,
  responseType,
}: {
  messages: BaseChatMessage[];
  responseType: string;
}) => {
  return (
    <div className="flex flex-col mt-5 overflow-scroll">
      {messages.map((m, index) => {
        if (m._getType() === 'human') {
          return (
            <div key={index} className="flex justify-end mb-4">
              <div className="px-4 py-3 mr-2 text-white bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl">
                {m.text}
              </div>
            </div>
          );
        } else if (m._getType() === 'ai') {
          return (
            <div key={index} className="flex justify-start mb-4">
              <div className="px-4 py-3 ml-2 text-white bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl">
                <Message responseType={responseType} text={m.text} />
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

const Message = ({ responseType, text }: { text: string; responseType: string }) => {
  const [option, setOption] = React.useState<Record<string, unknown>>({});

  React.useEffect(() => {
    try {
      const response = JSON.parse(text);
      setOption(getOption(responseType, response));
    } catch (error) {
      console.log("Can't parse message:", text);
    }
  }, [responseType, text]);

  if (responseType === 'general') {
    return <ReactMarkdown>{text}</ReactMarkdown>;
  }
  return <ReactECharts option={option} style={{ height: 400, width: 600 }} />;
};
