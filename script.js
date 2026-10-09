// DOM reference
const levelContainer=document.getElementById("level-container");
const wordContainer=document.getElementById("word-container");
const spinner=document.getElementById("spinner");
const wordModal=document.getElementById("word_modal");
const detailsContainer=document.getElementById("details-container");
const searchInput=document.getElementById("input-search");
const searchButton=document.getElementById("btn-search");
//2.UI state function

const manageSpinner=(status)=>{
    if(status){
        spinner.classList.remove("hidden");
        wordContainer.classList.add("hidden");
    }
    else{
        spinner.classList.add("hidden");
        wordContainer.classList.remove("hidden");
    }
}

const removeActive=()=>{
    const lessonButtons=document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach((button)=>{
        button.classList.remove("active");
    })

}
// UTILITY function
const createsynonymElements=(synonyms)=>{
    return synonyms
    .map((synonym)=>`<span class="btn">${synonym} </span>`)
    .join("");
};

// API section

const loadLessons=async()=>{
const response=await fetch(  "https://openapi.programming-hero.com/api/levels/all");
const data=await response.json();
displayLessons(data.data);
}


const loadLevelWords=async(level)=>{
    manageSpinner(true)
    const response=await fetch( `https://openapi.programming-hero.com/api/level/${level}`);
    const data= await response.json();
    displayLevelWords(data.data);
    manageSpinner(false);

}

const loadWordDetail=async(id)=>{
    const response=await fetch(  `https://openapi.programming-hero.com/api/word/${id}`);
    const data=await response.json();
    displayWordDetails(data.data);
}

const loadAllWords=async()=>{
    const response=await fetch("https://openapi.programming-hero.com/api/words/all");

    const data=await response.json();
    return data.data;
}

// Render functions
const displayLessons=(lessons)=>{
    levelContainer.innerHTML="";
    lessons.forEach((lesson)=>{
        const buttonContainer=document.createElement("div");
        
        buttonContainer.innerHTML=`
        <button id="lesson-btn-${lesson.level_no}" class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open-reader"></i>
        Lesson-${lesson.level_no}
        </button>
        `;
       buttonContainer
       .querySelector("button")
       .addEventListener("click",()=>{
        removeActive();
        buttonContainer
        .querySelector("button")
        .classList.add("active");

        loadLevelWords(lesson.level_no);
       });
       levelContainer.append(buttonContainer);
    });
}

const displayLevelWords=(words)=>{
    wordContainer.innerHTML="";
    if(words.length===0){
       wordContainer.innerHTML=`
       <div class="text-center bg-sky-100 rounded-xl col-span-full space-y-10 py-6 font-bangla">
       <img class="mx-auto" src="english-janala-resources/assets/alert-error.png">
       <p class="text-xl font-medium text-gray-400">
       এখনো এই লেসনে কোনো শব্দভান্ডার যোগ করিনি
       </p>
       <h2 class="font-bold text-xl">
       “পরবর্তী লেসনে যাও।”
       </h2>


       `;
       return;
    }
   words.forEach((words)=>{
    const card=document.createElement("div");
    card.innerHTML=`
    <div class="bg-white rounded-xl shadow-sm py-10 px-5 text-center">
    <h2 class="font-bold text-2xl">
    ${words.word || "কোনো শব্দ পাওয়া যায়নি"}
    </h2>
    <p class="font-semibold">
    Meaning/Pronounciation
    </p>
    <div class="text-2xl font-semibold font-bangla">
     ${words.meaning || "শব্দটির কোনো অর্থ পাওয়া যায়নি"}
     </div>
     <div class="flex justify-between items-center mt-5">
     <button class="btn info-btn">
      <i class="fa-solid fa-circle-info"></i>
      </button>
      <button class="btn audio-btn">
       <i class="fa-solid fa-volume-high"></i>
       </button>
       </div>
       </div>


    `;
    card.querySelector(".info-btn")
    .addEventListener(("click"),()=>{
        loadWordDetail(words.id)
    });

   wordContainer.append(card); 


   });


   
};
const displayWordDetails=(words)=>{
    detailsContainer.innerHTML=`
    <div>
    <h2 class="text-2xl font-bold">
    ${words.word}
    <i class="fa-solid fa-microphone-lines"></i>

    </div>

    <div>
    <h2 class="font-bold">Meaning </h2>
    <p>${words.meaning} </p>
    </div>

    <div>
    <h2 class="font-bold">Example </h2>
    <p> ${words.sentence} </p>
    </div>
    <div>
    <h2 class="font-bold"> Synonyms </h2>
    <div>
    ${createsynonymElements(words.synonyms)}
    </div>
    </div>
    `;
    wordModal.showModal();
};
const handleSearch=async()=>{
    const searchValue=searchInput.value.trim().toLowerCase();
    if(!searchValue){
        return
    }
    manageSpinner(true);
   const allWords=await loadAllWords();
   const filterWords=allWords.filter((word)=>
    word.word.toLowerCase().includes(searchValue)
)
displayLevelWords(filterWords);
manageSpinner(false);
}
// Event handle controler
searchButton.addEventListener("click",handleSearch);




  






// Initizalations
loadLessons();
