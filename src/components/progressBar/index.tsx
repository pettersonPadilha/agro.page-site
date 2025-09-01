interface ProgressBarProps {
  progress: string;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="mt-8 px-4">
      <p className="text-white pb-1 text-sm">Etapa 1</p>
      <div className="flex items-center gap-3 justify-between">
        <div className="bg-white h-1 w-4/12">
          <div
            style={{ width: progress }}
            className="bg-theme-orange h-1"
          ></div>
        </div>
        <div className="bg-white h-1 w-4/12"></div>
        <div className="bg-white h-1 w-4/12"></div>
        <div className="bg-white h-1 w-4/12"></div>
      </div>
    </div>
  );
}
