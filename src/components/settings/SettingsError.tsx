interface SettingsErrorProps {
  message: string;
  onRetry: () => void;
}

export function SettingsError({ message, onRetry }: SettingsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
      <p className="text-red-400">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-medium text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}