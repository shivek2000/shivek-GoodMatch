import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { CSVRecord } from './part2.model';
import { CSVDataArr } from './part2Arr.model';

@Component({
  selector: 'app-part2',
  templateUrl: './part2.component.html',
  styleUrls: ['./part2.component.css']
})
export class Part2Component {

  constructor(private http: HttpClient) { }

  @ViewChild('csvReader') csvReader: any;

  uploadListener($event: any): void {  
  
    let files = $event.srcElement.files;  
  
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        this.getDataRecordsArrayFromCSVFile(csvRecordsArray);  
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } else {  
      alert("Please import valid .csv file.");  
      this.fileReset();  
    }  
  }  

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any) {  

    let playersM = [];
    let playersF = [];

    //check for letters only
    var regEx_LetterOnly = /^[A-Za-z]+$/;

    for (let i = 0; i < csvRecordsArray.length; i++) {  

      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  

      let csvRecord: CSVRecord = new CSVRecord();  

      //checking if first position of csv is not empty
      if(curruntRecord[0].trim() != ''){

        csvRecord.name = curruntRecord[0].trim();

      }

      else{

        alert("Issue with data in csv, please make sure it is in the format of \"PlayerName,Gender\"");
        this.fileReset();
        return;

      }

      //making sure player names are alphabets/letters only
      if(!curruntRecord[0].trim().match(regEx_LetterOnly)){

        alert("Issue with data in csv, please make sure that player names contain alphabets only");
        this.fileReset();
        return;

      }

      //checking if second position of csv is not empty or if it contains a gender symbol
      if(curruntRecord[1].trim().toLowerCase() === 'm' || curruntRecord[1].trim().toLowerCase() === 'f' && curruntRecord[1].trim() != ''){

        csvRecord.gender = curruntRecord[1].trim();

      }

      else{

        alert("Issue with data in csv, please make sure it is in the format of \"PlayerName,Gender\"");
        this.fileReset();
        return;

      }

      //separating players based on gender
      if(curruntRecord[1].trim().toLowerCase() === "m"){

        playersM.push(csvRecord);

      }

      if(curruntRecord[1].trim().toLowerCase() === "f"){

        playersF.push(csvRecord);

      }
      
    }
    
    //making sure there are equal players of both genders to make a double's team
    if(playersM.length != playersF.length){

      alert("Issue with data in csv, Please make sure there are equal males to females in order to make full teams");
      this.fileReset();
      return;
    }

    else{
      
      console.log(playersM);
      console.log(playersF);

      const data: CSVDataArr = {playersMArr: playersM, playersFArr: playersF}

      this.http.post<{message: String}>("http://localhost:3000/api/checkNamesCSV", data).subscribe((res) =>{

          if(res.message === "Success"){

            this.fileReset();
            alert("File processed successfully");

          }

      });

    }
  }
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  
  
  fileReset() {  
    this.csvReader.nativeElement.value = "";   
  }


}
