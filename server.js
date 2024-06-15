const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors'); 

const app = express();
const port = 3000;

// Specify the full path to the Python executable
const pythonExecutable = "C:\\python312\\python.exe";  // Modify this path accordingly
app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

app.post('/gaussian', upload.single('image'), (req, res) => {
    const inputPath = req.file.path;
    const outputPath = `outputs/gaussian_${req.file.filename}.png`;
    exec(`${pythonExecutable} filter/gaussian_filter.py ${inputPath} ${outputPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error processing image');
        }
        res.json({ imageUrl: `http://localhost:${port}/${outputPath}` });
    });
});

app.post('/butterworth', upload.single('image'), (req, res) => {
    const inputPath = req.file.path;
    const outputPath = `outputs/butterworth_${req.file.filename}.png`;
    exec(`${pythonExecutable} filter/butterworth_filter.py ${inputPath} ${outputPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error processing image');
        }
        res.json({ imageUrl: `http://localhost:${port}/${outputPath}` });
    });
});

app.post('/laplacian', upload.single('image'), (req, res) => {
    const inputPath = req.file.path;
    const outputPath = `outputs/laplacian_${req.file.filename}.png`;
    exec(`${pythonExecutable} filter/laplacian_filter.py ${inputPath} ${outputPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error processing image');
        }
        res.json({ imageUrl: `http://localhost:${port}/${outputPath}` });
    });
});

app.post('/histogram', upload.fields([{ name: 'source' }, { name: 'reference' }]), (req, res) => {
    const sourceImagePath = path.resolve(req.files['source'][0].path).replace(/\\/g, "/");
    const referenceImagePath = path.resolve(req.files['reference'][0].path).replace(/\\/g, "/");
    const outputPath = path.resolve(__dirname, `outputs/histogram_${req.files['source'][0].filename}.png`).replace(/\\/g, "/");
    const command = `${pythonExecutable} filter/histogram_matching.py "${sourceImagePath}" "${referenceImagePath}" "${outputPath}"`;

    console.log(`Executing command: ${command}`);

    exec(command, (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(`Error processing image: ${stderr || error.message}`);
        }
        res.json({ imageUrl: `http://localhost:${port}/outputs/${path.basename(outputPath)}` });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
