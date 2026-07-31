import type { CellContext, ColumnDef } from "@tanstack/react-table";
import { useMemo, useState, type CSSProperties } from "react";
import {
  EditableCell,
  Gigatable,
  themes,
  type EditableCellInputProps,
  useGigatable,
} from "../gigatable";
import {
  BadgeCell,
  DateCell,
  DialogCell,
  NumberCell,
  PopoverCell,
  ProgressCell,
  SelectCell,
  type CellOption,
  type CellTone,
} from "../gigatable/cells";
import { useSiteTheme } from "../site/theme";
import {
  parseDemoDate,
  parseDemoNumber,
  parseDemoOption,
} from "./demo-editor-utils";

type TicketPriority = "low" | "normal" | "high" | "urgent";
type TicketStatus = "new" | "investigating" | "waiting" | "resolved";
type TicketChannel = "email" | "chat" | "phone" | "api";

interface SupportTicket extends Record<string, unknown> {
  id: string;
  subject: string;
  customer: string;
  channel: TicketChannel;
  priority: TicketPriority;
  status: TicketStatus;
  agent: string;
  slaDate: string;
  progress: number;
  summary: string;
}

const customerAccounts = [
  { value: "Northstar Labs", plan: "Scale", region: "Europe" },
  { value: "Arcade Cloud", plan: "Business", region: "North America" },
  { value: "Meridian Health", plan: "Enterprise", region: "Asia Pacific" },
  { value: "Cinder Works", plan: "Scale", region: "Europe" },
  { value: "Juniper Travel", plan: "Business", region: "North America" },
  { value: "Beacon Foods", plan: "Enterprise", region: "Asia Pacific" },
] as const;
const agentProfiles = [
  { value: "Ava Singh", team: "Identity" },
  { value: "Mateo Silva", team: "Platform" },
  { value: "Nora Kim", team: "Data" },
  { value: "Leo Martin", team: "Billing" },
  { value: "Sara Novak", team: "Applications" },
] as const;
const subjects = [
  "SSO provisioning is delayed",
  "Export contains duplicate records",
  "Webhook deliveries are timing out",
  "Billing seats need reconciliation",
  "Dashboard filters reset unexpectedly",
  "Mobile session cannot refresh",
];
const channelOptions: ReadonlyArray<CellOption<TicketChannel>> = [
  { value: "email", label: "Email" },
  { value: "chat", label: "Chat" },
  { value: "phone", label: "Phone" },
  { value: "api", label: "API" },
];
const priorityOptions: ReadonlyArray<CellOption<TicketPriority>> = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];
const statusOptions: ReadonlyArray<CellOption<TicketStatus>> = [
  { value: "new", label: "New" },
  { value: "investigating", label: "Investigating" },
  { value: "waiting", label: "Waiting" },
  { value: "resolved", label: "Resolved" },
];
const customerOptions: ReadonlyArray<CellOption<string>> = customerAccounts.map(
  ({ value }) => ({ value, label: value }),
);
const agentOptions: ReadonlyArray<CellOption<string>> = agentProfiles.map(
  ({ value }) => ({ value, label: value }),
);

const priorityTone: Record<TicketPriority, CellTone> = {
  low: "neutral",
  normal: "info",
  high: "warning",
  urgent: "danger",
};
const statusTone: Record<TicketStatus, CellTone> = {
  new: "info",
  investigating: "warning",
  waiting: "neutral",
  resolved: "success",
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function TextInput({
  value,
  onChange,
  onBlur,
  onKeyDown,
}: EditableCellInputProps<string>) {
  return (
    <input
      autoFocus
      type="text"
      value={value ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      aria-label="Ticket subject"
    />
  );
}

export function buildSupportTickets(count = 250): Array<SupportTicket> {
  return Array.from({ length: count }, (_, index) => {
    const customer = customerAccounts[index % customerAccounts.length].value;
    const agent = agentProfiles[index % agentProfiles.length].value;
    const status = statusOptions[index % statusOptions.length].value;
    const subject = subjects[index % subjects.length];
    const day = String((index % 27) + 1).padStart(2, "0");
    return {
      id: `TKT-${String(index + 1201).padStart(5, "0")}`,
      subject,
      customer,
      channel: channelOptions[index % channelOptions.length].value,
      priority: priorityOptions[index % priorityOptions.length].value,
      status,
      agent,
      slaDate: `2026-08-${day}`,
      progress:
        status === "resolved"
          ? 100
          : status === "waiting"
            ? 62
            : status === "investigating"
              ? 38
              : 12,
      summary: `${customer} reported that ${subject.toLowerCase()}. The support team owns the next response.`,
    };
  });
}

export const supportColumns: Array<ColumnDef<SupportTicket>> = [
  { accessorKey: "id", header: "Ticket", size: 105 },
  {
    accessorKey: "subject",
    header: "Subject",
    size: 250,
    cell: (cell) => (
      <EditableCell
        {...(cell as CellContext<SupportTicket, string>)}
        renderInput={TextInput}
      />
    ),
    meta: { editable: true, getClearedValue: () => "" },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    size: 165,
    cell: (cell) => (
      <PopoverCell
        {...(cell as CellContext<SupportTicket, string>)}
        trigger={(value) => value}
        ariaLabel={`Customer for ${cell.row.original.id}`}
        renderEditor={({ value, onChange }) => (
          <label className="grid gap-2 text-xs font-semibold">
            Customer account
            <select
              value={value}
              onChange={(event) => onChange(event.currentTarget.value)}
              className="rounded border border-[var(--gt-cell-border-color)] bg-[var(--gt-row-bg)] px-2 py-2"
            >
              {customerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}
        details={(value) => {
          const account = customerAccounts.find(
            (candidate) => candidate.value === value,
          );
          return (
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs">
              <dt className="opacity-60">Plan</dt>
              <dd>{account?.plan ?? "Unknown"}</dd>
              <dt className="opacity-60">Region</dt>
              <dd>{account?.region ?? "Unknown"}</dd>
            </dl>
          );
        }}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => customerOptions[0].value,
      parsePastedValue: (value, cell) =>
        parseDemoOption(value, customerOptions, cell.getValue<string>()),
    },
  },
  {
    accessorKey: "channel",
    header: "Channel",
    size: 95,
    cell: (cell) => (
      <SelectCell
        {...(cell as CellContext<SupportTicket, TicketChannel>)}
        options={channelOptions}
        ariaLabel={`Channel for ${cell.row.original.id}`}
        renderOption={(_option, value) => (
          <BadgeCell
            label={value.toUpperCase()}
            tone={value === "api" ? "info" : "neutral"}
          />
        )}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => "email",
      parsePastedValue: (value, cell) =>
        parseDemoOption(value, channelOptions, cell.getValue<TicketChannel>()),
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    size: 110,
    cell: (cell) => (
      <SelectCell
        {...(cell as CellContext<SupportTicket, TicketPriority>)}
        options={priorityOptions}
        ariaLabel={`Priority for ${cell.row.original.id}`}
        renderOption={(option, value) => (
          <BadgeCell
            label={option?.label ?? value}
            tone={priorityTone[value]}
          />
        )}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => "normal",
      parsePastedValue: (value, cell) =>
        parseDemoOption(
          value,
          priorityOptions,
          cell.getValue<TicketPriority>(),
        ),
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 125,
    cell: (cell) => (
      <SelectCell
        {...(cell as CellContext<SupportTicket, TicketStatus>)}
        options={statusOptions}
        ariaLabel={`Status for ${cell.row.original.id}`}
        renderOption={(option, value) => (
          <BadgeCell label={option?.label ?? value} tone={statusTone[value]} />
        )}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => "new",
      parsePastedValue: (value, cell) =>
        parseDemoOption(value, statusOptions, cell.getValue<TicketStatus>()),
    },
  },
  {
    accessorKey: "agent",
    header: "Assigned agent",
    size: 160,
    cell: (cell) => (
      <PopoverCell
        {...(cell as CellContext<SupportTicket, string>)}
        trigger={(value) => value}
        ariaLabel={`Assigned agent for ${cell.row.original.id}`}
        renderEditor={({ value, onChange }) => (
          <label className="grid gap-2 text-xs font-semibold">
            Assigned agent
            <select
              value={value}
              onChange={(event) => onChange(event.currentTarget.value)}
              className="rounded border border-[var(--gt-cell-border-color)] bg-[var(--gt-row-bg)] px-2 py-2"
            >
              {agentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}
        details={(value) => {
          const profile = agentProfiles.find(
            (candidate) => candidate.value === value,
          );
          return (
            <p className="m-0 text-xs opacity-70">
              {profile?.team ?? "General"} support · Online now
            </p>
          );
        }}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => agentOptions[0].value,
      parsePastedValue: (value, cell) =>
        parseDemoOption(value, agentOptions, cell.getValue<string>()),
    },
  },
  {
    accessorKey: "slaDate",
    header: "SLA due",
    size: 135,
    cell: (cell) => (
      <DateCell
        {...(cell as CellContext<SupportTicket, string>)}
        ariaLabel={`SLA date for ${cell.row.original.id}`}
        min="2026-07-31"
        max="2027-12-31"
        formatValue={(value) =>
          dateFormatter.format(new Date(`${value}T00:00:00Z`))
        }
      />
    ),
    meta: {
      editable: true,
      allowFill: true,
      getClearedValue: () => "",
      parsePastedValue: (value, cell) =>
        parseDemoDate(
          value,
          cell.getValue<string>(),
          "2026-07-31",
          "2027-12-31",
        ),
    },
  },
  {
    accessorKey: "progress",
    header: "Resolution",
    size: 175,
    cell: (cell) => (
      <NumberCell
        {...(cell as CellContext<SupportTicket, number>)}
        ariaLabel={`Resolution progress for ${cell.row.original.id}`}
        min={0}
        max={100}
        step={1}
        variant="range"
        suffix="%"
        tone={(value) => (value === 100 ? "success" : "info")}
        renderValue={(value) => (
          <ProgressCell
            value={value}
            label={`Resolution progress for ${cell.row.original.id}`}
            tone={value === 100 ? "success" : "info"}
          />
        )}
      />
    ),
    meta: {
      editable: true,
      getClearedValue: () => 0,
      parsePastedValue: (value, cell) =>
        parseDemoNumber(value, cell.getValue<number>(), 0, 100),
    },
  },
  {
    accessorKey: "summary",
    header: "Conversation",
    size: 130,
    cell: (cell) => (
      <DialogCell
        {...(cell as CellContext<SupportTicket, string>)}
        trigger="Edit ticket"
        title={`${cell.row.original.id} · ${cell.row.original.subject}`}
        description={`${cell.row.original.customer} via ${cell.row.original.channel}`}
        ariaLabel={`Conversation for ${cell.row.original.id}`}
        renderEditor={({ value, onChange }) => (
          <label className="grid gap-2 text-sm font-semibold">
            Conversation summary
            <textarea
              autoFocus
              rows={8}
              value={value}
              onChange={(event) => onChange(event.currentTarget.value)}
              className="w-full resize-y rounded border border-[var(--gt-cell-border-color)] bg-[var(--gt-row-bg)] p-3 font-normal leading-6"
            />
          </label>
        )}
      />
    ),
    meta: {
      editable: true,
      allowFill: false,
      getClearedValue: () => "",
    },
  },
];

export function SupportOperationsDemo() {
  const { resolvedTheme } = useSiteTheme();
  const [data] = useState(() => buildSupportTickets());
  const {
    table,
    paste,
    applyFill,
    applyHorizontalFill,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useGigatable({
    columns: supportColumns,
    data,
    getRowId: (row) => row.id,
    history: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });
  const totalSize = useMemo(() => table.getTotalSize(), [table]);

  return (
    <div className="demo-scenario-stack">
      <div className="demo-control-bar">
        <p className="demo-live-count">
          <strong>250 active tickets · 9 editable fields</strong>
          <span>Double-click, press Enter, or Alt/Option-click to edit</span>
        </p>
        <div className="demo-history-actions">
          <button type="button" onClick={undo} disabled={!canUndo}>
            Undo
          </button>
          <button type="button" onClick={redo} disabled={!canRedo}>
            Redo
          </button>
        </div>
      </div>
      <div
        className="demo-table-shell"
        style={{ "--gt-table-height": "58vh" } as CSSProperties}
      >
        <Gigatable
          theme={resolvedTheme === "dark" ? themes.giga : themes.light}
          table={table}
          allowCellSelection
          allowRangeSelection
          allowQuickEdit
          allowHistory
          allowPaste
          allowFillHandle
          fillDirection="both"
          allowColumnResizing
          paste={paste}
          applyFill={applyFill}
          applyHorizontalFill={applyHorizontalFill}
          undo={undo}
          redo={redo}
          tableStyle={{ width: `${totalSize}px` }}
        />
      </div>
    </div>
  );
}
