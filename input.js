#!/usr/bin/env nodev
let inputarr=process.argv.slice(2);
let fs = require("fs");
let path = require("path");
//console.log(inputarr);

let command=inputarr[0];

switch(command)
{
    case "tree":
        treeFn(inputarr[1],"");
        break;
    
    case "organize":
       organizeFn(inputarr[1]);
        break;
    
    case "help":
        helpFn(inputarr[1]);
        break;
    
    default:
        console.log("provide input");
        break;

}

function helpFn(dirPath)
{
    console.log("help command implemented for",dirPath);
}

let types={
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}
function organizeFn(dirPath)
{let destpath;
    if(dirPath==undefined){
        console.log("enter correct path");return;
    }
    else{
        let doesExist=fs.existsSync(dirPath);
        if(doesExist)
        {
            destpath=path.join(dirPath,"organize_files");
            if(fs.existsSync(destpath)==false)
            {
            fs.mkdirSync(destpath);}
        }
        else
        {
            console.log("enter correct path");
            return;
        }
    }
    console.log("organize command implemented for",dirPath);
    organizeHelper(dirPath,destpath);
}


function organizeHelper(src,des)
{
    let childname=fs.readdirSync(src);
     //console.log(childname);
     for (let i = 0; i < childname.length; i++) {
        let childAddress = path.join(src, childname[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {
          //  console.log(childname[i]);
          let category=getcategory(childname[i]);
          console.log(childname[i], "belongs to --> ", category);
          //copy / cut  files to that organized directory inside of any of category folder 
          sendFiles(childAddress, des,category);
        }
    }
}

function sendFiles(srcFilePath, dest, category) {
     
    let categoryPath = path.join(dest, category);
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    
    console.log(fileName, "copied to ", category);
    fs.unlinkSync(srcFilePath)

}




function getcategory(name)
{
    let ext=path.extname(name);
    ext=ext.slice(1);
 //console.log(ext);  // noe campare it with types object
 for (let key in types) {
    let cTypeArray = types[key];
    for (let i = 0; i < cTypeArray.length; i++) {
        if (ext == cTypeArray[i]) {
            return key;
        }
    }
}
return "others";
    
}

function treeFn(dirPath)
{
    let destpath;
    if(dirPath==undefined){
        treehelper(process.cwd(), "");
        return;
    }
    else{
        let doesExist=fs.existsSync(dirPath);
        if(doesExist)
        {
           treehelper(dirPath,"");
        }
        else
        {
            console.log("enter correct path");
            return;
        }
    }
    console.log("organize command implemented for",dirPath);
}

function treehelper(dirPath,indent)
{
      // is file or folder
      let isFile = fs.lstatSync(dirPath).isFile();
      if (isFile == true) {
          let fileName = path.basename(dirPath);
          console.log(indent + "├──" + fileName);
      } else {
          let dirName = path.basename(dirPath)
          console.log(indent + "└──" + dirName);
          let childrens = fs.readdirSync(dirPath);
          for (let i = 0; i < childrens.length; i++) {
              let childPath = path.join(dirPath, childrens[i]);
              treehelper(childPath, indent + "\t");
          }
      }

}

