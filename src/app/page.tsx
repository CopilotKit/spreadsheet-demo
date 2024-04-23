"use client";
import "@copilotkit/react-ui/styles.css";

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import SingleSpreadsheet from "./components/SingleSpreadsheet";
import {
  CopilotKit,
  useCopilotAction,
  useMakeCopilotReadable,
} from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { INSTRUCTIONS } from "./instructions";

const HomePage = () => {
  return (

    <CopilotKit url="/api/copilotkit">
      <CopilotSidebar
        instructions={INSTRUCTIONS}
        labels={{
          initial: "Welcome to the spreadsheet app! How can I help you?",
        }}
        cloud_guardrails={...}
        cloud_memoryAndHistory={true}
        defaultOpen={true}
        clickOutsideToClose={false}
        cloud_selfLearning={true}
      >
        <Main />
      </CopilotSidebar>
    </CopilotKit>
    
  );
};

const Main = () => {
  const [spreadsheets, setSpreadsheets] = React.useState<Spreadsheet[]>([
    {
      title: "Spreadsheet 1",
      data: [
        [{ value: "" }, { value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }, { value: "" }],
      ],
    },
  ]);

  const [selectedSpreadsheetIndex, setSelectedSpreadsheetIndex] = useState(0);

  useCopilotAction({
    name: "createSpreadsheet",
    description: "Create a new  spreadsheet",
    parameters: [
      {
        name: "rows",
        type: "object[]",
        description: "The rows of the spreadsheet",
        attributes: [
          {
            name: "columns",
            type: "object[]",
            description: "The columns of the row",
            attributes: [
              {
                name: "value",
                type: "string",
                description: "The value of the cell",
              },
            ],
          },
        ],
      },

      {
        name: "title",
        type: "string",
        description: "The title of the spreadsheet",
      },
    ],
    render: "Creating spreadsheet...",
    handler: ({ rows, title }) => {
      const data: Row[] = [];
      for (const row of rows || []) {
        const columns: Cell[] = [];
        for (const column of row.columns) {
          columns.push({ value: column.value });
        }
        data.push(columns);
      }
      const newSpreadsheet: Spreadsheet = {
        title: title,
        data,
      };
      setSpreadsheets((prev) => [...prev, newSpreadsheet]);
      setSelectedSpreadsheetIndex(spreadsheets.length);
    },
  });

  useMakeCopilotReadable("Todays date is: " + new Date().toLocaleDateString());

  return (
    <div className="flex">
      <Sidebar
        spreadsheets={spreadsheets}
        selectedSpreadsheetIndex={selectedSpreadsheetIndex}
        setSelectedSpreadsheetIndex={setSelectedSpreadsheetIndex}
      />
      <SingleSpreadsheet
        spreadsheet={spreadsheets[selectedSpreadsheetIndex]}
        setSpreadsheet={(spreadsheet) => {
          setSpreadsheets((prev) => {
            console.log("setSpreadsheet", spreadsheet);
            const newSpreadsheets = [...prev];
            newSpreadsheets[selectedSpreadsheetIndex] = spreadsheet;
            return newSpreadsheets;
          });
        }}
      />
    </div>
  );
};

export default HomePage;
