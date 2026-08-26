import {
  Braces,
  CalendarDays,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";
import type { ProjectSummary } from "../types.ts";

interface ProjectPreviewProps {
  variant: ProjectSummary["previewVariant"];
}

export function ProjectPreview({ variant }: ProjectPreviewProps) {
  if (variant === "booking") {
    return (
      <div className="relative h-full overflow-hidden bg-[#f8f3eb] text-[#2c3532]">
        <div className="flex h-[18%] items-center justify-between border-b border-[#2c3532]/8 px-[6%]">
          <span className="text-[clamp(7px,1vw,12px)] font-black">
            SPACE ON
          </span>
          <span className="rounded-full bg-[#2c3532] px-[5%] py-[2%] text-[clamp(5px,.65vw,8px)] font-bold text-white">
            예약하기
          </span>
        </div>
        <div className="grid h-[82%] grid-cols-[1.05fr_.95fr] items-center gap-[4%] px-[7%]">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#ffd8c7] px-[7%] py-[3%] text-[clamp(5px,.65vw,8px)] font-black text-[#a34325]">
              <CalendarDays size="1em" /> 오늘 가능한 공간
            </span>
            <p className="mt-[7%] text-[clamp(13px,2.3vw,28px)] font-black leading-[1.02] tracking-[-0.05em]">
              필요한 공간을
              <br />
              바로 예약하세요
            </p>
            <div className="mt-[8%] h-[9%] w-[48%] rounded-md bg-[#ec6b42]" />
          </div>
          <div className="grid grid-cols-2 gap-[6%]">
            {[0, 1, 2, 3].map((item) => (
              <span
                className="aspect-[1.15] rounded-[12%] border border-[#2c3532]/8 bg-white shadow-sm"
                key={item}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "community") {
    return (
      <div className="relative h-full overflow-hidden bg-[#eef2ff] text-[#202b52]">
        <div className="absolute -right-[8%] -top-[18%] size-[55%] rounded-full bg-[#b9c5ff]" />
        <div className="relative flex h-[18%] items-center justify-between px-[6%]">
          <span className="flex items-center gap-1.5 text-[clamp(7px,1vw,12px)] font-black">
            <MessageCircleMore size="1.2em" /> TALENT LINK
          </span>
          <span className="text-[clamp(5px,.65vw,8px)] font-bold">
            둘러보기 · 내 팀
          </span>
        </div>
        <div className="relative px-[7%] pt-[5%]">
          <p className="text-[clamp(13px,2.3vw,28px)] font-black leading-[1.02] tracking-[-0.05em]">
            우리 팀에 필요한
            <br />
            재능을 연결해요
          </p>
          <div className="mt-[7%] flex gap-[3%]">
            {["DESIGN", "DEV", "VIDEO"].map((item) => (
              <span
                className="rounded-full border border-[#202b52]/15 bg-white/75 px-[5%] py-[2.5%] text-[clamp(5px,.6vw,8px)] font-black"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mt-[8%] h-[1px] w-full bg-[#202b52]/12" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden bg-[#fffaf1] text-[#17332f]">
      <div className="flex h-[18%] items-center justify-between border-b border-[#17332f]/8 px-[6%]">
        <span className="flex items-center gap-1.5 text-[clamp(7px,1vw,12px)] font-black">
          <span className="grid size-[clamp(14px,2vw,24px)] place-items-center rounded-md bg-[#17332f] text-[#d9ef7d]">
            <Braces size="60%" />
          </span>
          mvpilot
        </span>
        <span className="text-[clamp(5px,.65vw,8px)] font-bold text-[#17332f]/45">
          TEMPLATE · GENERATE · VERIFY
        </span>
      </div>
      <div className="grid h-[82%] grid-cols-[1.05fr_.95fr] items-center gap-[3%] px-[7%]">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f2cc] px-[6%] py-[2.5%] text-[clamp(5px,.65vw,8px)] font-black text-[#375226]">
            <Sparkles size="1em" /> AI BUILD
          </span>
          <p className="mt-[6%] text-[clamp(14px,2.5vw,30px)] font-black leading-[.98] tracking-[-0.06em]">
            아이디어를
            <br />
            <span className="whitespace-nowrap text-[#ec6b42]">
              작동하는 데모로
            </span>
          </p>
        </div>
        <div className="relative aspect-square rounded-full bg-[#d9ef7d]/70">
          <span className="absolute inset-[16%_9%_10%] rotate-2 rounded-[12%] border-2 border-[#17332f] bg-white shadow-[5px_5px_0_#ec6b42]" />
        </div>
      </div>
    </div>
  );
}
