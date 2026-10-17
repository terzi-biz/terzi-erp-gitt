import React from 'react';

export default function JournalPanel() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h3 className="text-lg font-bold">Automation Journal</h3>
      <p className="mt-1 text-sm text-muted-foreground">Last runs and execution results.</p>
      <div className="mt-4 overflow-hidden rounded-md border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2">Rule</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Started</th>
              <th className="px-3 py-2">Result</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Lead qualified → task</td>
              <td className="px-3 py-2">success</td>
              <td className="px-3 py-2">2026-10-17</td>
              <td className="px-3 py-2">task created</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
