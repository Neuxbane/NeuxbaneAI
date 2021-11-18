function Copy(Obj){return JSON.parse(JSON.stringify(Obj))}

class NeuxbaneNet {
    constructor(){
        this.dataset = {};
        this.NeuralCore = {};
        this.IsUpdate=false;
    }

    create(code=(create)=>{return[]}){
        console.log("Creating Neural Network...\n")
        let create = {};
        create.Network = [];

        // A neural network inputs
        create.Input = (size=[[64,64],[64,64]],Options=null)=>{ // ex. size = 64x64x2
            let net = [];let a;
            for(let channels=0;channels<size.length;channels++){
                let cnet = [];let dimension = [];let dimsize = 1;
                for(let a = 0;a<size[channels].length;a++){
                    dimsize*=size[channels][a];
                    dimension.push(0);
                }
                for(let a=0;a<dimsize;a++){
                    if(dimension[0]==size[channels][0]){
                        for(let b=0;b<dimension.length-1;b++){
                            if(dimension[b]==size[channels][b]){
                                dimension[b]=0;
                                dimension[b+1]++;
                            }
                        }
                    }
                    cnet.push({coordinates:Copy(dimension),value:0});
                    dimension[0]++;
                }net.push(cnet);
            }
            create.Network.push(net)
            console.log({type:"Input",value:net})
            return null;
        }


        create.Kernel = (size=[[3,3],[3,3],[3,3]],Options=null)=>{ // For Each Layer generate a kernel with 3x3 x3
            let net = [];
            for(let channels=0;channels<size.length;channels++){
                let cnet = [];let dimension = [];let dimsize = 1;
                for(let a = 0;a<size[channels].length;a++){
                    dimsize*=size[channels][a];
                    dimension.push(0);
                }
                for(let a=0;a<dimsize;a++){
                    if(dimension[0]==size[channels][0]){
                        for(let b=0;b<dimension.length-1;b++){
                            if(dimension[b]==size[channels][b]){
                                dimension[b]=0;
                                dimension[b+1]++;
                            }
                        }
                    }
                    cnet.push({coordinates:Copy(dimension),value:0});
                    dimension[0]++;
                }
                net.push(cnet);
            }
            create.Network.push(net);
            console.log({type:"Kernel",value:net});
        }

        create.FC = (size=[2,2])=>{// Full Connected Layer, then convert size to @size
            
        }

        create.MaxPooling = (size=[2,2])=>{ // Each layer will do maxpooling 2x2
            let net = [];
            for(let a = 0;a<size.length;a++){
                dimsize*=size[a];
                dimension.push(0);
            }
            for(let a=0;a<dimsize;a++){
                if(dimension[0]==size[0]){
                    for(let b=0;b<dimension.length-1;b++){
                        if(dimension[b]==size[b]){
                            dimension[b]=0;
                            dimension[b+1]++;
                        }
                    }
                }
                net.push({coordinates:Copy(dimension),value:0});
                dimension[0]++;
            }
            create.Network.push({type:'MaxPooling',value:net});
            console.log(net);
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


        // create.FC = (size,actfunc="1*")=>{
        //     let net = [];
        //     for(let a=0;a<size;a++){
        //         let eva = actfunc+"(";
        //         for(let b=0;b<create.MathNet[create.netID].length;b++){
        //             create.parameters.weights.push({name:"W_ID"+[create.netID,a,b].join('_'),val:Math.random()*2-1,at:create.netID,id:b});
        //             create.parameters.neurons.push({name:"N_"+[create.netID,b].join('_'),val:Math.random()*2-1});
        //             eva+="n.N_"+[create.netID,b].join('_')+"*"+"n.W_ID"+[create.netID,a,b].join('_');
        //             if(create.MathNet[create.netID].length-1!=b){eva+="+";}
        //             else{
        //                 eva+="+n.B_ID"+[create.netID,a].join('_');
        //                 create.parameters.biases.push({name:"B_ID"+[create.netID,a].join('_'),val:Math.random()*2-1,at:create.netID,id:b});
        //                 eva+=")";}
        //         }
        //         net.push(eva);
        //     }
        //     create.MathNet.push(net);
        //     create.netID++
        //     return null;
        // }
        this.NeuralCore = code(create).Network;
        // console.log("Math Equation(s):\n-----------");
        // for(let a=0;a<this.NeuralCore.MathNet.length;a++){
        //     console.log(`\nMath Equation Output ${String(a)}\n--------\n${this.NeuralCore.MathNet[a].join('\n')}`)
        // }
        // console.log("\n\nParameters:\n---------\n",this.NeuralCore.parameters,"\nDone!\nTotal parameters:",this.NeuralCore.parameters.inputs.length+this.NeuralCore.parameters.weights.length+this.NeuralCore.parameters.biases.length+this.NeuralCore.parameters.neurons.length);
        // let declare="";
        // for(let b=0;b<this.NeuralCore.parameters.weights.length;b++){
        //     declare+="n."+this.NeuralCore.parameters.weights[b].name+"="+String(this.NeuralCore.parameters.weights[b].val)+";";
        // }
        // for(let b=0;b<this.NeuralCore.parameters.biases.length;b++){
        //     declare+="n."+this.NeuralCore.parameters.biases[b].name+"="+String(this.NeuralCore.parameters.biases[b].val)+";";
        // }this.NeuralCore.declare=declare;
        // try{console.log(`The Neural Network uses approximately ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`);}catch(e){}
        // return null;
    }
  
    eval(inputs=[[2,2],[2,2]]){

    }


    getloss(){
        let er=0;
        for(let m=0;m<this.dataset.length;m++){
            for(let dn=0;dn<this.dataset[m].length;dn++){
                let res=this.eval(this.dataset[m][dn][0]);
                for(let cl=0;cl<res.length;cl++){
                    er+=Math.pow(res[cl]-this.dataset[m][dn][1][cl],2);
                }
            }
        }
        return er;
    }

    getError(){
        let error=[];
        for(let m=0;m<this.dataset.length;m++){
            for(let dn=0;dn<this.dataset[m].length;dn++){
                let res=this.eval(this.dataset[m][dn][0]);
                for(let ly=0;ly<res.length;ly++){
                    error.push(res[ly]-this.dataset[m][dn][1][ly]);
                }
                //console.log(error);
            }
        }
        return error;
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
    create.FC()
    create.Kernel([[2]]);
    return create;
});
e.dataset = TRAINING_DATA_SETS;
const Options = {learning_rate:0.3,min_loss:0}
//e.train(Options);
//console.log("error\n",e.getError())
//for(let a=0;a<2;a++){console.log(e.eval([[a,2]]));}