import { createReadStream, promises as fs } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const rootDirectory = path.join(repoRoot, "wwwroot");
const port = Number.parseInt(process.env.PORT ?? "5002", 10);

const contentTypes = new Map([
    [".html", "text/html; charset=utf-8"],
    [".css", "text/css; charset=utf-8"],
    [".js", "application/javascript; charset=utf-8"],
    [".json", "application/json; charset=utf-8"],
    [".txt", "text/plain; charset=utf-8"],
    [".svg", "image/svg+xml"]
]);

function resolvePath(urlPath) {
    const pathname = decodeURIComponent((urlPath ?? "/").split("?")[0]);
    const candidate = pathname === "/" ? "/index.html" : pathname;
    const absolutePath = path.normalize(path.join(rootDirectory, candidate));

    if (!absolutePath.startsWith(rootDirectory)) {
        return null;
    }

    return absolutePath;
}

const server = http.createServer(async (request, response) => {
    const absolutePath = resolvePath(request.url);
    if (!absolutePath) {
        response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Bad request");
        return;
    }

    try {
        const stat = await fs.stat(absolutePath);
        if (!stat.isFile()) {
            response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Not found");
            return;
        }

        const extension = path.extname(absolutePath).toLowerCase();
        const contentType = contentTypes.get(extension) ?? "application/octet-stream";
        response.writeHead(200, { "Content-Type": contentType });
        createReadStream(absolutePath).pipe(response);
    } catch {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
    }
});

server.listen(port, "127.0.0.1", () => {
    console.log(`Serving ${rootDirectory} at http://127.0.0.1:${port}`);
});
