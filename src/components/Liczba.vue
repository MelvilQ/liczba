<script>
  import {TNSTextToSpeech} from 'nativescript-texttospeech';
  import * as app from 'tns-core-modules/application';
  
  export default {
    name: 'Liczba',
    data () {
      return {
        TTS: null,
        languages: [
          {name: 'Polish', code: 'pl', country: 'pl'},
          {name: 'German', code: 'de', country: 'de'},
          {name: 'English', code: 'en', country: 'us'},
          {name: 'French', code: 'fr', country: 'fr'},
          {name: 'Spanish', code: 'es', country: 'es'},
          {name: 'Italian', code: 'it', country: 'it'},
          {name: 'Dutch', code: 'nl', country: 'nl'},
          {name: 'Russian', code: 'ru', country: 'ru'},
        ],
        selectedLanguageIndex: 0,
        number: 1,
        minNumber: 0,
        maxNumber: 20,
        entered: '',
        score: 0,
        goal: 20
      };
    },
    computed: {
      languageNames(){
        return this.languages.map(l => l.name);
      },
      selectedLanguage(){
        return this.languages[this.selectedLanguageIndex];
      },
      enteredNumber(){
        return parseInt(this.entered);
      },
      stars(){
        return '*'.repeat(this.score);
      }
    },
    methods: {
      setVolumeToMedia(){
        app.on(app.resumeEvent, args => {
          args.object.foregroundActivity.setVolumeControlStream(android.media.AudioManager.STREAM_MUSIC);
        });
      },
      pickNewNumber(){
        this.number = Math.floor(Math.random() * (this.maxNumber - this.minNumber + 1)) - this.minNumber;
        this.speakNumber();
      },
      speakNumber(){
        const utterance = {
          text: this.number.toString(),
          language: this.selectedLanguage.code,
        };
        this.TTS.speak(utterance);
      },
      regainFocus(){
        this.$refs.textfield.nativeView.focus();
      },
      check(){
        if(this.enteredNumber === this.number){
          this.score += 1;
          this.score = Math.min(this.score, this.goal);
          this.pickNewNumber();
        } else {
          this.score -= 3;
          this.score = Math.max(this.score, 0);
          this.speakNumber();
        }
        this.entered = '';
        this.regainFocus();
      },
      flagUrl(country){
        return 'https://raw.githubusercontent.com/hjnilsson/country-flags/master/svg/'
          + country + '.svg?sanitize=true';
      }
    },
    created(){
      if(app.android){
        this.setVolumeToMedia();
      }
      this.TTS = new TNSTextToSpeech();
      this.pickNewNumber();
    },
    mounted(){
      this.regainFocus();
    },
  };
</script>

<template>
  <Page class="page">
    <ActionBar class="action-bar" title="Liczba"/>
    <StackLayout class="liczba" horizontalAlignment="center">
      <Label :text="stars" :class="{golden: score >= 20}"/>
      <Button class="btn btn-primary" text="Say it again" @tap="speakNumber" padding="10"/>
      <TextField v-model="entered" returnKeyType="go" autocorrect="false" keyboardType="number" 
        maxLength="4" @returnPress="check" @blur="regainFocus" ref="textfield"/>
      <ListPicker :items="languageNames" v-model="selectedLanguageIndex" @selectedIndexChange="speakNumber" />
    </StackLayout>
  </Page>
</template>

<style scoped>
.liczba {
  margin: 20;
}

TextField {
  color: white;
  font-size: 40;
  text-align: center;
}

label {
  font-size: 30;
  color: white;
  text-align: center;
}

ListPicker {
  font-size: 20;
  color: white;
  text-align: center;
}

.golden {
  color: yellow;
}
</style>
