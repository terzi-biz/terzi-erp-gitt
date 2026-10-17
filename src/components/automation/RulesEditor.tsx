import React from 'react';

export default function RulesEditor() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-lg font-bold">Control Center — Rules</h2>
      <p className="mt-1 text-sm text-muted-foreground">Create, test and manage automation rules.</p>
      <div className="mt-4 flex gap-2">
        <button type="button" className="rounded-md border border-border px-3 py-2 text-sm">Create rule</button>
      </div>
      <div className="mt-4 overflow-hidden rounded-md border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Trigger</th>
              <th className="px-3 py-2">Entity</th>
              <th className="px-3 py-2">Enabled</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-3 py-2">Lead qualified → task</td>
              <td className="px-3 py-2">field_changed</td>
              <td className="px-3 py-2">lead</td>
              <td className="px-3 py-2">Yes</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
