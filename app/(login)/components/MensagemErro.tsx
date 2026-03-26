export default function MensagemErro({ error }: { error?: string }) {
    if (!error) return null;

    return (
        <div className="absolute z-10 bg-orange-500 text-white text-xs p-2 rounded shadow-lg -mt-1 ml-2 animate-bounce">
            <div className="absolute -top-1 left-4 w-2 h-2 bg-orange-500 rotate-45"></div>
            {error}
        </div>
    );
}