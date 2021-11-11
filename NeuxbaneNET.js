function dot(A=[[1,2],[3,4],[5,6]],B=[[5,1],[1,1]]){
    let res=[];for(let i=0;i<A.length;i++){let a=[];for(let j=0;j<B.length;j++){let r=0;for(let k=0;k<B[j].length;k++){r+=A[i][k]*B[k][j]}a.push(r);}res.push(a);}return res;
}

class NeuxbaneNet {
    constructor(){
        this.dataset = {};
        this.NeuralCore = {};
        this.Istraining=false;
    }

    dot(A,B){let res=[];for(let i=0;i<A.length;i++){let a=[];for(let j=0;j<B.length;j++){let r=0;for(let k=0;k<B[j].length;k++){r+=A[i][k]*B[k][j]}a.push(r);}res.push(a);}return res;}

    create(code=(create)=>{return[]}){
        console.log("Creating Neural Network...\n")
        let create = {};
        create.parameters = {inputs:[],weights:[],biases:[]};
        create.netID = -1;
        create.MathE = [];

        // A neural network inputs
        create.Input = (size=[[64,64],[64,64]])=>{ // ex. size = 64x64x2
            let net = [];
            for(let channel=0;channel<size.length;channel++){
                let ch=[];
                let count = 1;
                let countd=[];
                for(let a=0;a<size[channel].length;a++){
                    count*=size[channel][a];
                    countd.push(0);
                }
                for(let a=0;a<count;a++){
                    if(countd[0]==size[channel][0]){
                        for(let b=0;b<size[channel].length;b++){
                            if(countd[b]==size[channel][b]){
                                countd[b]=0;
                                if(b<size[channel].length){countd[b+1]++;}
                            }
                        }
                    }
                    ch.push("n.I_C"+String(channel)+"_D"+countd.join('_'));
                    create.parameters.inputs.push({name:"I_C"+String(channel)+"_D"+countd.join('_'),val:0});
                    countd[0]++;
                }net.push(ch);
            }
            create.MathNet = net;
            return null;
        }


        create.Convert = ()=>{
            let net = [];
            for(let a=0;a<create.MathNet.length;a++){
                for(let b=0;b<create.MathNet[a].length;b++){
                    net.push(create.MathNet[a][b]);
                }
            }
            create.MathNet = net;
            return null;
        }


        create.FC = (size,actfunc="1*")=>{
            create.netID++
            let net = [];
            for(let a=0;a<size;a++){
                let eva = actfunc+"(";
                for(let b=0;b<create.MathNet.length;b++){
                    create.parameters.weights.push({name:"W_ID"+[create.netID,a,b].join('_'),val:Math.random()*2-1});
                    eva+=create.MathNet[b]+"*"+"n.W_ID"+[create.netID,a,b].join('_');
                    if(create.MathNet.length-1!=b){eva+="+";}
                    else{
                        eva+="+n.B_ID"+[create.netID,a].join('_');
                        create.parameters.biases.push({name:"B_ID"+[create.netID,a].join('_'),val:Math.random()*2-1});
                        eva+=")";}
                }
                net.push(eva);
            }
            create.MathNet=net;
            return null;
        }
        this.NeuralCore = code(create);
        //console.log("Math Equation(s):\n-----------");
        console.log(/*"Parameters:\n---------\n",this.NeuralCore.parameters,*/"Done!\nTotal parameters:",this.NeuralCore.parameters.inputs.length+this.NeuralCore.parameters.weights.length+this.NeuralCore.parameters.biases.length);
        for(let a=0;a<this.NeuralCore.MathNet.length;a++){
            console.log(this.NeuralCore.MathNet[a].length);
        }
        let declare="";
        for(let b=0;b<this.NeuralCore.parameters.weights.length;b++){
            declare+="n."+this.NeuralCore.parameters.weights[b].name+"="+String(this.NeuralCore.parameters.weights[b].val)+";";
        }
        for(let b=0;b<this.NeuralCore.parameters.biases.length;b++){
            declare+="n."+this.NeuralCore.parameters.biases[b].name+"="+String(this.NeuralCore.parameters.biases[b].val)+";";
        }this.NeuralCore.declare=declare;
        console.log(`The Neural Network uses approximately ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`);
        return null;
    }

    eval(inputs=[[2,2],[2,2]]){
        console.time('total');
        console.time('declare');
        let ret = [];
        let declare="let n={};";
        let arr = [];
        for(let a=0;a<inputs.length;a++){
            for(let b=0;b<inputs[a].length;b++){
                arr.push(inputs[a][b]);
            }
        }
        for(let a=0;a<arr.length;a++){
            this.NeuralCore.parameters.inputs[a].val=arr[a];
        }
        for(let b=0;b<this.NeuralCore.parameters.inputs.length;b++){
            declare+="n."+this.NeuralCore.parameters.inputs[b].name+"="+String(this.NeuralCore.parameters.inputs[b].val)+";";
        }

        if(this.Istraining){
            let de="";
            for(let b=0;b<this.NeuralCore.parameters.weights.length;b++){
                de+="n."+this.NeuralCore.parameters.weights[b].name+"="+String(this.NeuralCore.parameters.weights[b].val)+";";
            }
            for(let b=0;b<this.NeuralCore.parameters.biases.length;b++){
                de+="n."+this.NeuralCore.parameters.biases[b].name+"="+String(this.NeuralCore.parameters.biases[b].val)+";";
            }
            this.NeuralCore.declare=de;declare+=de;
        }else{declare+=this.NeuralCore.declare}
        
        declare+="\n\n";

        let sigmoid = (x)=>{return 1.0/(1.0+Math.exp(-x))};
        let tanh = (x)=>{return Math.tanh(x)}
        let relu = (x)=>{return x>0?x:0}
        let leaky_relu = (x)=>{return x>0?x:x/10}
        let binary = (x)=>{return x>0.5}
        console.timeEnd('declare');
        console.time('calculation');
        for(let a=0;a<this.NeuralCore.MathNet.length;a++){
            ret.push(eval(declare+this.NeuralCore.MathNet[a]));
        }
        console.timeEnd('calculation');
        console.timeEnd('total');
        return ret;
    }

    getloss(){
        let er=0;
        for(let m=0;m<this.dataset.length;m++){
            for(let dn=0;dn<this.dataset[m].length;dn++){
                let res=this.eval(this.dataset[m][dn][0]);
                for(let cl=0;cl<res.length;cl++){
                    er+=Math.pow(res[cl]-this.dataset[m][dn][1][cl],2)}
            }
        }
        return er;
    }

    train(learning_rate=0.1,epoch=40){
        this.Istraining=true;
        for(let ep=0;ep<epoch;ep++){
            console.log(epoch,this.getloss());
            
        }
        this.Istraining=false;
        return null;
    }
}




let TRAINING_DATA_SETS=
[
    [
        [[ [1,1] ],[1]],
        [[ [0,0] ],[1]],
        [[ [0,1] ],[0]],
        [[ [1,0] ],[0]]
    ]
];

let e = new NeuxbaneNet;
e.create((create)=>{
    create.Input([[2]]);
    create.Convert();
    create.FC(10,'leaky_relu');
    create.FC(30,'tanh');
    create.FC(1,'sigmoid');
    return create;
});

e.dataset = TRAINING_DATA_SETS;

e.train();

//for(let a=0;a<30;a++){console.log(e.eval([[1,1]]));}