import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Part1Names } from './part1.model';

@Component({
  selector: 'app-part1',
  templateUrl: './part1.component.html',
  styleUrls: ['./part1.component.css']
})

export class Part1Component {

  constructor(private http: HttpClient) { }

  firstName = "";
  secondName = "";
  matchPercentage = "";

  onCheckMatch(Part1Form: NgForm){

    if(Part1Form.invalid){
      alert("Please enter names of both players to match")
      return;
    }

    this.firstName = Part1Form.value.firstName;
    this.secondName = Part1Form.value.secondName;

    const names: Part1Names = {firstName: this.firstName, secondName: this.secondName};
    
    //check for letters only
    var regEx_LetterOnly = /^[A-Za-z]+$/;

    if(!this.firstName.match(regEx_LetterOnly) || !this.secondName.match(regEx_LetterOnly)){

      alert("Please enter alphabets/letters only");

    }

    else{
      this.http.post<{message: string}>("http://localhost:3000/api/checkNames", names).subscribe((res) =>{

      this.matchPercentage = res.message;

      if(parseInt(this.matchPercentage) >= 80){

        alert(this.firstName + " matches " + this.secondName + " with a value of " + this.matchPercentage + "% and is a good match");
  
      }
  
      else{
  
        alert(this.firstName + " matches " + this.secondName + " with a value of " + this.matchPercentage + "%");
  
      }

    });
    }

  }

}
