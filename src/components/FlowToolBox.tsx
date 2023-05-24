export interface Tool {
  title: string;
  type: string;
  content?: string;
}

export const FlowToolBox = ({ tools }: { tools: Tool[] }) => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, { type, content }: Tool) => {
    event.dataTransfer.setData('application/reactflow_type', type);
    if (content) {
      event.dataTransfer.setData('application/reactflow_content', content);
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="fixed left-0 z-20 p-2 m-1 transform -translate-y-1/2 bg-white rounded-lg shadow-lg top-1/2">
      <div className="mx-2 my-1 text-xl font-bold">Tool Box</div>
      {tools.map((tool) => (
        <div
          className="items-center justify-center p-1 my-1 text-xl border border-black border-solid rounded-md"
          onDragStart={(event) => onDragStart(event, tool)}
          draggable
        >
          {tool.title}
        </div>
      ))}
    </div>
  );
};
