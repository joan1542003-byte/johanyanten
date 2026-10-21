// Satoshi from Fontshare (free for commercial use), loaded as a stylesheet in each root layout
export function FontLinks() {
  return (
    <>
      <link rel="preconnect" href="https://api.fontshare.com" />
      <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
        precedence="default"
      />
    </>
  );
}
