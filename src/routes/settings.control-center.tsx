import { createFileRoute } from '@tanstack/react-router';
import RulesEditor from '@/components/automation/RulesEditor';
import JournalPanel from '@/components/automation/JournalPanel';

export const Route = createFileRoute('/settings/control-center')({
  component: ControlCenterPage,
  head: () => ({
    meta: [
      { title: 'Control Center' },
      { name: 'description', content: 'Automation rules, integrations and execution journal.' },
    ],
  }),
});

function ControlCenterPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-black">Control Center</h1>
        <p className="text-sm text-muted-foreground">Automation, integrations and process control by rule.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RulesEditor />
        <JournalPanel />
      </div>
    </div>
  );
}
