class NeuxbaneNet {
    constructor(){
        this.dataset = {};
        this.NeuralCore = {};
        this.IsUpdate=false;
    }

    dot(A,B){let res=[];for(let i=0;i<A.length;i++){let a=[];for(let j=0;j<B.length;j++){let r=0;for(let k=0;k<B[j].length;k++){r+=A[i][k]*B[k][j]}a.push(r);}res.push(a);}return res;}

    create(code=(create)=>{return[]}){
        console.log("Creating Neural Network...\n")
        let create = {};
        create.parameters = {inputs:[],weights:[],biases:[], neurons:[]};
        create.netID = -1;
        create.MathNet = [];

        // A neural network inputs
        create.Input = (size=[[64,64],[64,64]])=>{ // ex. size = 64x64x2
            let net = [];
            for(let channel=0;channel<size.length;channel++){
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
                    net.push("n.I_C"+String(channel)+"_D"+countd.join('_'));
                    create.parameters.inputs.push({name:"I_C"+String(channel)+"_D"+countd.join('_'),val:0});
                    countd[0]++;
                }
            }
            create.MathNet.push(net);
            create.netID++
            return null;
        }


        create.Kernel = (size=[64,64])=>{//2Dimension 64x64
            return null;
        }

        create.MaxPooling = ()=>{
            return null;
        }


        // create.Convert = ()=>{
        //     let net = [];
        //     for(let a=0;a<create.MathNet.length;a++){
        //         for(let b=0;b<create.MathNet[a].length;b++){
        //             net.push(create.MathNet[a][b]);
        //         }
        //     }
        //     create.MathNet.push(net);
        //     console.log(net);
        //     return null;
        // }


        create.FC = (size,actfunc="1*")=>{
            let net = [];
            for(let a=0;a<size;a++){
                let eva = actfunc+"(";
                for(let b=0;b<create.MathNet[create.netID].length;b++){
                    create.parameters.weights.push({name:"W_ID"+[create.netID,a,b].join('_'),val:Math.random()*2-1,at:create.netID,id:b});
                    create.parameters.neurons.push({name:"N_"+[create.netID,b].join('_'),val:Math.random()*2-1});
                    eva+="n.N_"+[create.netID,b].join('_')+"*"+"n.W_ID"+[create.netID,a,b].join('_');
                    if(create.MathNet[create.netID].length-1!=b){eva+="+";}
                    else{
                        eva+="+n.B_ID"+[create.netID,a].join('_');
                        create.parameters.biases.push({name:"B_ID"+[create.netID,a].join('_'),val:Math.random()*2-1,at:create.netID,id:b});
                        eva+=")";}
                }
                net.push(eva);
            }
            create.MathNet.push(net);
            create.netID++
            return null;
        }
        this.NeuralCore = code(create);
        console.log("Math Equation(s):\n-----------");
        for(let a=0;a<this.NeuralCore.MathNet.length;a++){
            console.log(`\nMath Equation Output ${String(a)}\n--------\n${this.NeuralCore.MathNet[a].join('\n')}`)
        }
        console.log("\n\nParameters:\n---------\n",this.NeuralCore.parameters,"\nDone!\nTotal parameters:",this.NeuralCore.parameters.inputs.length+this.NeuralCore.parameters.weights.length+this.NeuralCore.parameters.biases.length+this.NeuralCore.parameters.neurons.length);
        let declare="";
        for(let b=0;b<this.NeuralCore.parameters.weights.length;b++){
            declare+="n."+this.NeuralCore.parameters.weights[b].name+"="+String(this.NeuralCore.parameters.weights[b].val)+";";
        }
        for(let b=0;b<this.NeuralCore.parameters.biases.length;b++){
            declare+="n."+this.NeuralCore.parameters.biases[b].name+"="+String(this.NeuralCore.parameters.biases[b].val)+";";
        }this.NeuralCore.declare=declare;
        try{console.log(`The Neural Network uses approximately ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`);}catch(e){}
        return null;
    }
  
    eval(inputs=[[2,2],[2,2]],at=Infinity,id=Infinity){
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

        if(this.IsUpdate){
            let de="";
            for(let b=0;b<this.NeuralCore.parameters.weights.length;b++){
                de+="n."+this.NeuralCore.parameters.weights[b].name+"="+String(this.NeuralCore.parameters.weights[b].val)+";";
            }
            for(let b=0;b<this.NeuralCore.parameters.biases.length;b++){
                de+="n."+this.NeuralCore.parameters.biases[b].name+"="+String(this.NeuralCore.parameters.biases[b].val)+";";
            }
            this.NeuralCore.declare=de;declare+=de;this.IsUpdate=false;
        }else{declare+=this.NeuralCore.declare}

        let sigmoid = (x)=>{return 1.0/(1.0+Math.exp(-x))};
        let tanh = (x)=>{return Math.tanh(x)}
        let relu = (x)=>{return x>0?x:0}
        let leaky_relu = (x)=>{return x>0?x:x/10}
        let binary = (x)=>{return x>0.5}
        let neurons_res=[];
        for(let a=0;a<this.NeuralCore.MathNet.length;a++){
            let dec_neurons="";let brek=false;
            for(let b=0;b<neurons_res.length;b++){
                if(at!=Infinity){if(this.NeuralCore.parameters.weights.filter((data)=>{return data.at==at&&data.id==id})!=[]){brek=true}};
                if(at!=Infinity){if(this.NeuralCore.parameters.biases.filter((data)=>{return data.at==at&&data.id==id})!=[]){brek=true}};
                dec_neurons+="n.N_"+[a-1,b].join('_')+"="+String(neurons_res[b])+";";
            } dec_neurons+="\n";
            neurons_res=[];
            for(let b=0;b<this.NeuralCore.MathNet[a].length;b++){
                let res = eval(declare+dec_neurons+this.NeuralCore.MathNet[a][b]);
                neurons_res.push(res);
            }
            //console.log(neurons_res,declare,dec_neurons,this.NeuralCore.MathNet[a]);
        }
        return neurons_res;
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

    getError(at=0,name=""){
        let er=0;
        for(let m=0;m<this.dataset.length;m++){
            for(let dn=0;dn<this.dataset[m].length;dn++){
                console.log(m)
            }
        }
        return er;
    }

    train(Options){
        console.log('training...');
        if(Options.epoch==undefined){Options.epoch=Infinity};
        if(Options.learning_rate==undefined){Options.learning_rate=0.1};
        if(Options.min_loss==undefined){Options.min_loss=0};
        let momentum = {weights:[],biases:[]}; // Momentum at neural network training method is like aceleration on speed
        for(let w=0;w<this.NeuralCore.parameters.weights.length;w++){
            momentum.weights.push(Math.random()-0.5);
        }
        for(let w=0;w<this.NeuralCore.parameters.biases.length;w++){
            momentum.biases.push(Math.random()-0.5);
        }
        let ep=0;
        try{
            while(ep<Options.epoch&&Options.min_loss<this.getloss()){
                ep++;
                for(let w=0;w<this.NeuralCore.parameters.weights.length;w++){
                    let loss1=this.getloss();
                    this.NeuralCore.parameters.weights[w].val+=Options.learning_rate;this.IsUpdate=true;
                    let loss2=this.getloss();
                    this.NeuralCore.parameters.weights[w].val-=Options.learning_rate;this.IsUpdate=true;
                    let gradient=(loss2-loss1)/(Options.learning_rate);//x = ∆weight = Options.learning_rate, y = ∆error
                    momentum.weights[w]+=Options.learning_rate*gradient;
                    //momentum.weights[w]*=loss2>=1?(loss2*Options.learning_rate*10):1;
                    this.NeuralCore.parameters.weights[w].val-=momentum.weights[w];
                    this.IsUpdate=true;
                }
                for(let b=0;b<this.NeuralCore.parameters.biases.length;b++){
                    let loss1=this.getloss();
                    this.NeuralCore.parameters.biases[b].val+=Options.learning_rate;this.IsUpdate=true;
                    let loss2=this.getloss();
                    this.NeuralCore.parameters.biases[b].val-=Options.learning_rate;this.IsUpdate=true;
                    let gradient=(loss2-loss1)/(Options.learning_rate);//x = ∆weight = Options.learning_rate, y = ∆error
                    momentum.biases[b]+=Options.learning_rate*gradient;
                    //momentum.biases[b]*=loss2>=1?(loss2*Options.learning_rate*10):1;
                    this.NeuralCore.parameters.biases[b].val-=momentum.biases[b];
                    this.IsUpdate=true;
                }
                console.log(new Date(),"Epoch",ep,"Loss",this.getloss());
            }
        } catch(e){console.log(e)}
        for(let m=0;m<this.dataset.length;m++){
            for(let dn=0;dn<this.dataset[m].length;dn++){
                let res=this.eval(this.dataset[m][dn][0]);
                console.log(this.dataset[m][dn][0],"->",res);
            }
        }
        return null;
    }
}




const TRAINING_DATA_SETS=
[
    [
        [[ [0,0] ],[1]],
        [[ [1,1] ],[1]],
        [[ [0,1] ],[0]],
        [[ [1,0] ],[0]]
    ]
];

var e = new NeuxbaneNet;
e.create((create)=>{
    create.Input([[2]]);//1 Dimension, 2 point
    create.FC(3,'leaky_relu');
    create.FC(1,'sigmoid');
    return create;
});
e.dataset = TRAINING_DATA_SETS;
const Options = {learning_rate:0.3,min_loss:0}
//e.train(Options);
console.log(e.getError())
//for(let a=0;a<3;a++){console.log(e.eval([[a,2]]));}