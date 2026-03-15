export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`footer { display: none !important; }`}</style>
      {children}
    </>
  )
}
