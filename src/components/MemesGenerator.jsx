import { useEffect,useState, useRef } from "react";
import { toPng } from 'html-to-image';
import { Box,Button,Input,Stack } from '@chakra-ui/react'
import '../App.css'


const MemesGenerator = () => {
    const [memes, setMemes] = useState([]);
  const [currentMeme, setCurrentMeme] = useState([]);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const currentIndex = memes.indexOf(currentMeme);
  const elementRef = useRef(null);
  const [file, setFile] = useState();

    useEffect(() => {
        fetch('https://api.imgflip.com/get_memes')
          .then(res => res.json())
          .then(data => {
            setMemes(data.data.memes);
            const randomImageMeme = Math.floor(Math.random() * data.data.memes.length);
            setCurrentMeme(data.data.memes[randomImageMeme]);
          })
          .catch(error => console.error('Error fetching memes:', error));
      }, []);

//BUTTON FUNCTIONS
      const handleRandom= () => {
        const randomImageMeme = Math.floor(Math.random() * memes.length);
        setCurrentMeme(memes[randomImageMeme]);
      }
      const handlePrev = () => {
        const prevIndex = (currentIndex - 1) ;
        setCurrentMeme(memes[prevIndex]);
      };
      
      const handleNext = () => {
        const nextIndex = (currentIndex + 1) ;
        setCurrentMeme(memes[nextIndex]);
      };

      
     //download images 
        const htmlToImageConvert = () => {
          toPng(elementRef.current, { cacheBust: false })
            .then((dataUrl) => {
              const link = document.createElement("a");
              link.download = "my-image-name.png";
              link.href = dataUrl;
              link.click();
            })
            .catch((err) => {
              console.log(err);
            });
        };
      //upload image
      const handleImageUpload = (e) => {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
        localStorage.setItem("selectedImage", e.target.files);
      };
    return ( 
        <>
     
        <div >
        <div className="Inputs"> 
          <Input focusBorderColor='lime' placeholder='Top Text'
          type="text" 
          value={memes.topText} 
          onChange={(e) => setTopText(e.target.value)} />
          <Input focusBorderColor='lime' placeholder='Bottom Text'
          type="text" 
          value={memes.bottomText} 
          onChange={(e) => setBottomText(e.target.value)} />
          <input className="upload" type="file" onChange={handleImageUpload} />
        </div>
        <Stack direction='row' spacing={4}>
        <Button onClick={handleRandom}>Random Image</Button>
        <Button onClick={handlePrev}>previous</Button>
        <Button onClick={handleNext}>next</Button>
        <Button onClick={htmlToImageConvert}>Download!</Button>
        </Stack>
        
        </div>
        
        <div ref={elementRef} className="divImage">
            <div className="memestext">
                {topText} 
            </div>
            <div className="memestextBottiom">
                {bottomText} 
            </div>
            <Box>
            {file ? <img src={file} alt="Uploaded Image" /> : <img className="image-container" src={currentMeme.url} alt="" />}
            </Box>
           
        </div>
       
        
      
       
        </>
     );
}
 
export default MemesGenerator;

