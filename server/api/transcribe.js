import formidable from "formidable"
import { exec } from 'child_process'
import fs from "fs"
import path from "path"
import { Configuration, OpenAIApi } from "openai"

import { formatData, formatData2, getSimpleId } from "../../lib/utils"

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export default defineEventHandler(async (event) => {

    let dateTimeCreated = ''
    
    const form = formidable({ multiples: true })

    let data = await new Promise((resolve, reject) => {
        
        form.parse(event.req, (err, fields, files) => {

            if (err) {
                reject(err)
            }

            if (!files.file) {

                resolve({
                    status: "error",
                    message: "File not found",
                })

            }

            dateTimeCreated = fields.datetime
            
            if (files.file.mimetype.startsWith("application/octet-stream")) {
                
                let filename = Date.now() + Math.round(Math.random() * 100000) + files.file.originalFilename
                let newPath = `${path.join("public", "upload", filename)}`
                
                let oldPath = files.file.filepath
                
                fs.copyFileSync(oldPath, newPath)
                
                resolve({
                    status: "ok",
                    file: newPath,
                    url: `/upload/${filename}`
                })

            } else {

                resolve({
                    status: "error",
                    message: "File not audio data",
                })

            }

        })

    })

    if(data.status === "error") {
        return {
            status: "error"
        }
    }

    // begin trap here
    const forceFlag = false
    if(forceFlag) {
        
        //console.log('openai-api-key-1', config.openaiApiKey, process.env.OPENAI_API_KEY)
        console.log('openai-api-key-3', process.env.OPENAI_API_KEY, process.env.USE_WHISPER_API)
        console.log('audio-file', data.file, data.url)
        
        return {
            status: "error"
        }

    }
    // end trap here

    const useWhisperApi = (process.env.USE_WHISPER_API === 'true')

    let fileUrl = data.url
    let filePath = data.file

    if(useWhisperApi) {

        try {

            const file = fs.createReadStream(filePath)
            const model = 'whisper-1'
            const prompt = ''
            const response_format = 'srt' // vtt
            const temperature = 0
            const language = 'en'
    
            const response = await openai.createTranscription(
                file,
                model,
                prompt,
                response_format,
                temperature,
                language,
            )

            let text = response?.data
            if(text) {
                
                try {
                    fs.writeFileSync(`${filePath}.srt`, text)
                } catch (err) {
                    console.error(err)
                }

            }

            data = text ? {
                status: 'ok',
                pid: getSimpleId(),
                out: formatData2(text),
                url: fileUrl,
                datetime: dateTimeCreated,
            } : {
                status: 'error'
            }
            
        } catch(error) {
            
            console.log(error)
            
            data = {
                status: 'error'
            }

        }

    } else {

        const outputDir = path.join("public", "upload")

        let sCommand = `whisper './${filePath}' --language English --model tiny --output_dir '${outputDir}'`
        
        data = await new Promise((resolve, reject) => {

            exec(sCommand, (error, stdout, stderr) => {
                
                if (error) {
                    
                    resolve({
                        status: 'error',
                        message: "Failed to transcribe [1]",
                    })

                } else {

                    resolve({
                        status: 'ok',
                        error: stderr,
                        pid: getSimpleId(),
                        out: formatData(stdout),
                        url: fileUrl,
                        datetime: dateTimeCreated,
                    })

                }
                
            })

        })

    }

    if(data.status === "error" || data.out.length === 0) {

        if(fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return {
            status: "error"
        }
    }
    
    return data

})