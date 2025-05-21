<template>
  <main class="wrap">
     <section class="btnBox">
      <div><button @click="add" type="button" class="blueBtn">Add</button></div>
      <div><button type="button" class="greenBtn">Save</button></div>
      <div><button type="button" class="redBtn">Update</button></div>
    </section>
    <table class="">
      <thead>
        <tr>
          <th class="head">Name</th>
          <th class="head">Birthday</th>
          <th class="head">Salary</th>
          <th class="head">Address</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in personData" :key="item.Name+index">
          <td><input type="text" name="name" id="" :value="item.Name"></td>
          <td><input type="date" name="birthdat" id="" :value="item.DateOfBirth.split('T')[0]"></td>
          <td><input type="range" name="salary" min="0" max="100000" id="" :value="item.Salary"></td>
          <td><input type="text" name="address" id="" :value="item.Address"></td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script>
import axios from 'axios';
export default{
  data(){
    return{
      personData:[],
      errorMsg:'',
      
    }
  },
  methods:{
    async getData(){
      try {
        const response = await axios.get('http://nexifytw.mynetgear.com:45000/api/Record/GetRecords');
        this.personData = response.data.Data;
      } catch (error) {
        this.errorMsg = error.message
      }
    },
    add(){
      const newPerson = {
        Name: '',
        DateOfBirth: '',
        Salary: 0,
        Address: ''
      };
      this.personData.splice(0,0,newPerson);
    },
  },
  created(){
    this.getData();
  }
}
</script>

<style lang="scss" scoped>
button {
  border-radius: 10%;
  padding: 11px;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
filter:brightness(1.2);
}

table {
  width: 100%;
  border-collapse: collapse;
}

td , th{
  padding: 6px 10px;
  border-bottom:1px solid #e4e3e6;
}

input{
  width: 70%;
  padding: 7px 4px;
  border-radius: 3px;
  border: 1px solid#777777;
  font-size: 16px;
}

.wrap {
  margin: 50px auto;
  width: 80%;
}

.btnBox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.blueBtn {
  background-color: #0868f9;
}

.greenBtn {
  background-color: #1b7b4b;
}

.redBtn {
  background-color: #d72d3d;
}

.head{
  text-align: left;
  padding-bottom: 12px;
}

</style>
