import { useId, type SVGProps } from 'react'

export function Spinner(props: SVGProps<SVGSVGElement>) {
  const uid = useId()
  const fid = `spinner-filter-${uid}`
  const cls = (name: string) => `spinner-${name}-${uid}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      {...props}
    >
      <defs>
        <filter id={fid} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="b2" />
          <feMerge>
            <feMergeNode in="b1" />
            <feMergeNode in="b2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <style>{`
        .${cls('c')} { fill: currentColor; opacity: 0.05; }
        .${cls('s0')} { fill: currentColor; animation: ${cls('a0')} 1.2s infinite linear; }
        .${cls('s1')} { fill: currentColor; animation: ${cls('a1')} 1.2s infinite linear; }
        .${cls('s2')} { fill: currentColor; animation: ${cls('a2')} 1.2s infinite linear; }
        .${cls('s5')} { fill: currentColor; animation: ${cls('a3')} 1.2s infinite linear; }
        .${cls('s8')} { fill: currentColor; animation: ${cls('a4')} 1.2s infinite linear; }
        .${cls('s7')} { fill: currentColor; animation: ${cls('a5')} 1.2s infinite linear; }
        .${cls('s6')} { fill: currentColor; animation: ${cls('a6')} 1.2s infinite linear; }
        .${cls('s3')} { fill: currentColor; animation: ${cls('a7')} 1.2s infinite linear; }

        @keyframes ${cls('a0')} {
          0%,100% { opacity: 1.0; filter: url(#${fid}); }
          6%      { opacity: 1.0; filter: url(#${fid}); }
          12.5%   { opacity: 0.60; filter: none; }
          25%     { opacity: 0.30; filter: none; }
          37.5%   { opacity: 0.15; filter: none; }
          50%     { opacity: 0.10; filter: none; }
          87.5%   { opacity: 0.10; filter: none; }
          94%     { opacity: 0.10; filter: none; }
        }
        @keyframes ${cls('a1')} {
          0%      { opacity: 0.10; filter: none; }
          6%      { opacity: 0.10; filter: none; }
          12.5%   { opacity: 1.0; filter: url(#${fid}); }
          18.5%   { opacity: 1.0; filter: url(#${fid}); }
          25%     { opacity: 0.60; filter: none; }
          37.5%   { opacity: 0.30; filter: none; }
          50%     { opacity: 0.15; filter: none; }
          62.5%   { opacity: 0.10; filter: none; }
          100%    { opacity: 0.10; filter: none; }
        }
        @keyframes ${cls('a2')} {
          0%      { opacity: 0.10; filter: none; }
          12.5%   { opacity: 0.10; filter: none; }
          25%     { opacity: 1.0; filter: url(#${fid}); }
          31%     { opacity: 1.0; filter: url(#${fid}); }
          37.5%   { opacity: 0.60; filter: none; }
          50%     { opacity: 0.30; filter: none; }
          62.5%   { opacity: 0.15; filter: none; }
          75%     { opacity: 0.10; filter: none; }
          100%    { opacity: 0.10; filter: none; }
        }
        @keyframes ${cls('a3')} {
          0%      { opacity: 0.10; filter: none; }
          25%     { opacity: 0.10; filter: none; }
          37.5%   { opacity: 1.0; filter: url(#${fid}); }
          43.5%   { opacity: 1.0; filter: url(#${fid}); }
          50%     { opacity: 0.60; filter: none; }
          62.5%   { opacity: 0.30; filter: none; }
          75%     { opacity: 0.15; filter: none; }
          87.5%   { opacity: 0.10; filter: none; }
          100%    { opacity: 0.10; filter: none; }
        }
        @keyframes ${cls('a4')} {
          0%      { opacity: 0.10; filter: none; }
          37.5%   { opacity: 0.10; filter: none; }
          50%     { opacity: 1.0; filter: url(#${fid}); }
          56%     { opacity: 1.0; filter: url(#${fid}); }
          62.5%   { opacity: 0.60; filter: none; }
          75%     { opacity: 0.30; filter: none; }
          87.5%   { opacity: 0.15; filter: none; }
          100%    { opacity: 0.10; filter: none; }
        }
        @keyframes ${cls('a5')} {
          0%      { opacity: 0.15; filter: none; }
          12.5%   { opacity: 0.10; filter: none; }
          50%     { opacity: 0.10; filter: none; }
          62.5%   { opacity: 1.0; filter: url(#${fid}); }
          68.5%   { opacity: 1.0; filter: url(#${fid}); }
          75%     { opacity: 0.60; filter: none; }
          87.5%   { opacity: 0.30; filter: none; }
          100%    { opacity: 0.15; filter: none; }
        }
        @keyframes ${cls('a6')} {
          0%      { opacity: 0.30; filter: none; }
          12.5%   { opacity: 0.15; filter: none; }
          25%     { opacity: 0.10; filter: none; }
          62.5%   { opacity: 0.10; filter: none; }
          75%     { opacity: 1.0; filter: url(#${fid}); }
          81%     { opacity: 1.0; filter: url(#${fid}); }
          87.5%   { opacity: 0.60; filter: none; }
          100%    { opacity: 0.30; filter: none; }
        }
        @keyframes ${cls('a7')} {
          0%      { opacity: 0.60; filter: none; }
          12.5%   { opacity: 0.30; filter: none; }
          25%     { opacity: 0.15; filter: none; }
          37.5%   { opacity: 0.10; filter: none; }
          75%     { opacity: 0.10; filter: none; }
          87.5%   { opacity: 1.0; filter: url(#${fid}); }
          93.5%   { opacity: 1.0; filter: url(#${fid}); }
          100%    { opacity: 0.60; filter: none; }
        }
      `}</style>

      <rect className={cls('s0')} x="2"  y="2"  width="6" height="6" />
      <rect className={cls('s1')} x="9"  y="2"  width="6" height="6" />
      <rect className={cls('s2')} x="16" y="2"  width="6" height="6" />
      <rect className={cls('s3')} x="2"  y="9"  width="6" height="6" />
      <rect className={cls('c')}  x="9"  y="9"  width="6" height="6" />
      <rect className={cls('s5')} x="16" y="9"  width="6" height="6" />
      <rect className={cls('s6')} x="2"  y="16" width="6" height="6" />
      <rect className={cls('s7')} x="9"  y="16" width="6" height="6" />
      <rect className={cls('s8')} x="16" y="16" width="6" height="6" />
    </svg>
  )
}
