// src/components/LeadManagement.jsx
import React, { useState } from 'react';
import './LeadManagement.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Initial data structure for leads
const initialLeads = {
  Cold: [{ id: '1', name: 'John Doe' }, { id: '2', name: 'mr. nobody' }],
  Warm: [{ id: '3', name: 'Sam Wilson' }],
  Hot: [{ id: '4', name: 'Mathew Laresma' }],
  Cooked: [{ id: '5', name: 'Ronelo Mirafuentes' }]
};

const LeadManagement = () => {
  const [leads, setLeads] = useState(initialLeads);

  // Handle when drag ends
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return; // Dropped outside the list

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const start = [...leads[source.droppableId]];
    const [removed] = start.splice(source.index, 1);
    const end = [...leads[destination.droppableId]];
    end.splice(destination.index, 0, removed);

    setLeads((prevLeads) => ({
      ...prevLeads,
      [source.droppableId]: start,
      [destination.droppableId]: end
    }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        {Object.keys(leads).map((category) => (
          <Droppable key={category} droppableId={category}>
            {(provided) => (
              <div
                className="w-1/4 p-4 bg-gray-200 rounded"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="text-lg font-semibold">{category}</h2>
                {leads[category].map((lead, index) => (
                  <Draggable key={lead.id} draggableId={lead.id} index={index}>
                    {(provided) => (
                      <div
                        className="p-2 my-2 bg-white rounded shadow"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {lead.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default LeadManagement;
