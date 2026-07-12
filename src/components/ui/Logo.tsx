import Image from "next/image";

export function Logo({
  withWordmark = true,
  size = 36,
}: {
  withWordmark?: boolean;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/LogoUndercut.svg"
        alt="Undercut logo"
        width={size}
        height={size}
        preload
        className="rounded-lg"
      />
      {withWordmark && (
        <span className="text-lg font-bold tracking-tight text-text">
          Undercut
        </span>
      )}
    </div>
  );
}