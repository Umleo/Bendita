export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <h1>Menu Admin</h1>
            {children}
        </>
    )
}