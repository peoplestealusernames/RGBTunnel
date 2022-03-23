import { readFileSync } from "fs";
import http, { IncomingMessage } from "http";
import localtunnel from 'localtunnel';
import { SerialPort } from "serialport"

const port = new SerialPort({ 'path': 'COM5', baudRate: 9600 })

var PortOpen = false
port.on('open', () => {
    PortOpen = true;
    var data = { r: 0, g: 0, b: 0 };
    WriteRGB(data);
})

const requestListener = function (req: IncomingMessage, res: any) {
    let body = ''

    req.on('data', (chunk: any) => { body += chunk })

    req.on('end', () => {
        if (!req.url)
            return

        res.writeHead(200);
        const URLBreak = req.url.split('/')
        URLBreak.splice(0, 1)
        console.log(URLBreak)

        switch (URLBreak[0]) {
            case "API":
                WriteRGB(body)
                res.end('Hello, World!');
                break;

            case "static":
                console.log('./build/' + URLBreak.join('/'))
                res.end(readFileSync('./build/' + URLBreak.join('/')));
                break;

            default:
                res.end(readFileSync('./build/index.html'));
                break;
        }
    })
}

const server = http.createServer(requestListener);
server.listen(5555);

(async () => {
    console.log("Attempting tunnel")
    const tunnel = await localtunnel({ subdomain: 'brgbserver', port: 5555 });

    // the assigned public url for your tunnel
    // i.e. https://abcdefgjhij.localtunnel.me
    console.log(tunnel.url);

    tunnel.on('close', () => {
        // tunnels are closed
    });

    tunnel.on('error', console.log)
})();

async function WriteRGB(data: any) {
    if (typeof data == 'string') {
        data = JSON.parse(data)
    }

    console.log(data, PortOpen)
    if (PortOpen) {
        if (!data.r || !data.g || !data.b)
            return
        var write = "\n"
        write += ("|r" + data.r)
        write += ("|g" + data.g)
        write += ("|b" + data.b)
        write += "|\n"
        port.write(write)
    }
}