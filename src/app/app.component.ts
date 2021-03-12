import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import romanNumbers from './roman-numbers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  valueToConvert = this.formBuilder.group({
    value: ''
  });
  configToConvert = this.formBuilder.group({
    type: 'roman'
  });

  result;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  checkIfValidListHasItem(validList, symbol): Boolean {
    return validList.includes(symbol);
  }

  checkValidSymbols(symbols): Boolean {
    const invalidSymbols = symbols.filter(symbol => {
      const isSymbolValid = this.checkIfValidListHasItem(romanNumbers.validSymbols, symbol);
      return !isSymbolValid;
    });
    return invalidSymbols.length === 0;
  }

  checkEqualsMaximumSequence(symbols): Boolean {
    let romanNumber = symbols.join('');
    let isValid = true;
    romanNumbers.validSymbols.forEach(symbol => {
      let badSequence = new Array(4).fill(symbol).join("");
      if (romanNumber.indexOf(badSequence) > - 1) {
        isValid = false;
      }
    })
    return isValid;
  }

  checkIfAllPreviousSequencesAreValid(symbols, index, currentSymbol): Boolean {
    const AllSymbols = Object.keys(romanNumbers.values);
    const AllValues = AllSymbols.map(symbol => romanNumbers.values[symbol]);
    const currentValue = romanNumbers.values[currentSymbol];
    const previousSymbols = symbols.filter((e, i) => i < index);

    console.log({
      AllSymbols, AllValues, currentSymbol, currentValue, previousSymbols
    });

    return true;
  }

  checkIfAllPreviousItemsAreValid(symbols, currentIndex, currentSymbol): Boolean {
    const previousSymbols = symbols.filter((e, i) => i < currentIndex);
    const validPreviousSymbols = romanNumbers.validPrevious[currentSymbol];
    const invalidItemInPreviousSymbols = previousSymbols.filter(symbol => {
      const isSymbolValid = this.checkIfValidListHasItem(validPreviousSymbols, symbol);
      return !isSymbolValid;
    });

    console.log({
      previousSymbols, validPreviousSymbols, invalidItemInPreviousSymbols
    });

    return invalidItemInPreviousSymbols.length === 0;
  }

  checkIfAllNextItemsAreValid(symbols, currentIndex, currentSymbol): Boolean {
    const nextSymbols = symbols.filter((e, i) => i > currentIndex);
    const validNextSymbols = romanNumbers.validNext[currentSymbol];

    const invalidItemInNextSymbols = nextSymbols.filter(symbol => {
      const isSymbolValid = this.checkIfValidListHasItem(validNextSymbols, symbol);
      return !isSymbolValid;
    });

    return invalidItemInNextSymbols.length === 0;
  }

  checkPreviousAndNextValues(symbols) {
    let flag;
    for (let index = 0; index < symbols.length; index++) {
      const isFirstSymbol = index === 0;
      const isLastSymbol = index === symbols.length - 1;

      const currentSymbol = symbols[index];

      if (isFirstSymbol) {
        flag = this.checkIfAllNextItemsAreValid(symbols, index, currentSymbol);
      } else if (isLastSymbol) {
        flag = this.checkIfAllPreviousItemsAreValid(symbols, index, currentSymbol) && this.checkIfAllPreviousSequencesAreValid(symbols, index, currentSymbol);
      } else {
        flag = this.checkIfAllNextItemsAreValid(symbols, index, currentSymbol) && this.checkIfAllPreviousItemsAreValid(symbols, index, currentSymbol) && this.checkIfAllPreviousSequencesAreValid(symbols, index, currentSymbol);
      }
    }
    return flag;
  }

  checkSymbolsSequence(symbols): Boolean {
    return this.checkEqualsMaximumSequence(symbols) && this.checkPreviousAndNextValues(symbols);
  }

  checkRomanValue(value): Boolean {
    const symbols = value.split("");
    const hasOnlyValidSymbols = this.checkValidSymbols(symbols);
    const hasOnlyValidSequences = this.checkSymbolsSequence(symbols);
    return hasOnlyValidSymbols && hasOnlyValidSequences;
  }

  convertToDecimal(value) {
    const symbols = value.split("");
    let contador = 0;
    for (let index = 0; index < symbols.length; index++) {
      const currentSymbol = symbols[index];
      const nextSymbol = symbols[index + 1];

      const currentValue = romanNumbers.values[currentSymbol];

      if (nextSymbol) {
        const nextValue = romanNumbers.values[nextSymbol];
        if (nextValue <= currentValue) {
          contador += currentValue;
        } else {
          contador += (nextValue - currentValue);
          index += 2;
        }
      } else {
        contador += currentValue;
      }
    }
    this.result = contador;
  }

  convertToRoman(value) {
    return value;
  }

  onSubmit() {
    const { type } = this.configToConvert.value;
    const { value } = this.valueToConvert.value;

    if (type === "decimal") {
      let uppercaseRomanNumber = value.toUpperCase();
      const isValidRomanNumber = this.checkRomanValue(uppercaseRomanNumber);
      if (isValidRomanNumber) {
        this.convertToDecimal(uppercaseRomanNumber);
      } else {
        window.alert(`${uppercaseRomanNumber} não é um número válido.`);
      }
    } else if (type === "roman") {
      this.convertToRoman(value);
    }
  }
}
