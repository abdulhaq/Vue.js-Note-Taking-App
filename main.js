 Vue.component('note', {
   template: `<div class="note">
            <div v-if="note">
                <label for="title">Title</label>
                <input type="text" v-model="note.title" class="title" name="title" placeholder="Enter a title" />
                <label for="content">Content</label>
				<textarea class="content" name="content" v-model="note.content" placeholder="Enter some content"></textarea>
                <button @click="deletePage()" class="btn btn-danger">Delete Note</button>
				<button @click="savePage()" class="btn btn-success">Save Note</button>
            </div>
            <div v-else>
                <h1>&larr; To begin, create a new Note!</h1>
            </div>
        </div>
`,
   name: 'note',
        props: ['note'],
        methods: {
          deletePage () {
            this.$emit('delete-note')
          },
          savePage () {
            this.$emit('save-note')
          }
        }
 });
 
  Vue.component('NoteList', {
   template: `<div class="NoteList">
            <ul>
                <li v-for="(note, index) of pages" class="note" v-bind:class="{ 'active': index === activePage }" @click="changePage(index)">
                    <div>{{note.title}}</div>
                </li>
                <li class="new-note" @click="newPage()">New Note +</li>
            </ul>
        </div>
`,
   name: 'NoteList',
        props: ['pages', 'activePage'],
        methods: {
          changePage (index) {
            this.$emit('change-note', index)
          },
          newPage () {
            this.$emit('new-note')
          }
        }
 });

const app = new Vue({
    el: "#app",
    data: {
      pages: [],
	  index: 0
    },
	props: ['activePage'],
    methods: {
		newPage () {
          this.pages.push({
            title: '',
            content: ''
          })
          this.index = this.pages.length - 1
        },
        changePage (index) {
          this.index = index
        },
        savePage () {
		   var note = this.pages[this.index]
		   if (note.id) {
		     fetch("http://rest.learncode.academy/api/Abdul/noteApp/" + note.id, {
             method: "PUT",
			 headers: {
             "Content-Type": "application/json",
             },
             body: JSON.stringify({title: note.title, content: note.content}),
             })
		   } else {
		     fetch("http://rest.learncode.academy/api/Abdul/noteApp/", {
             method: "POST",
             headers: {
             "Content-Type": "application/json",
             },
             body: JSON.stringify({title: note.title, content: note.content}),
             })
		   }
        },
        deletePage () {
		  var note = this.pages[this.index]
          fetch("http://rest.learncode.academy/api/Abdul/noteApp/" + note.id, {
          method: "DELETE"
          })
          .then(() => {
          this.notes.splice(i, 1);
          })
          this.pages.splice(this.index, 1)
          this.index = Math.max(this.index - 1, 0)
        }
    },
    mounted() {
      fetch("http://rest.learncode.academy/api/Abdul/noteApp/")
        .then(response => response.json())
        .then((data) => {
          this.pages = data;
        })
    },
    template: `
    <div id="app" class="row">
	
        <NoteList @change-note="changePage" @new-note="newPage" :pages="pages" :activePage="index" />
		<note @save-note="savePage" @delete-note="deletePage" :note="pages[index]" />
	</div>	
    `,
});