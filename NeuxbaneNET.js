var Jimp = require('jimp'); // npm i jimp, to get pixel from an image.
//can export some part of neural network using @.export

function dot(A=[[1,2],[3,4],[5,6]],B=[[5,1],[1,1]]){
    var res=[];for(var i=0;i<A.length;i++){var a=[];for(var j=0;j<B.length;j++){var r=0;for(var k=0;k<B[j].length;k++){r+=A[i][k]*B[k][j]}a.push(r);}res.push(a);}return res;
}

class NeuxbaneNet {
    constructor(){
        this.dataset = {};
        this.NeuralCore = {};
        this.Istraining=false;
    }

    dot(A,B){var res=[];for(var i=0;i<A.length;i++){var a=[];for(var j=0;j<B.length;j++){var r=0;for(var k=0;k<B[j].length;k++){r+=A[i][k]*B[k][j]}a.push(r);}res.push(a);}return res;}

    create(code=(create)=>{return[]}){
        console.log("Creating Neural Network...\n")
        var create = {};
        create.parameters = {inputs:[],weights:[],biases:[]};
        create.netID = -1;
        create.MathE = [];

        // A neural network inputs
        create.Input = (size=[[64,64],[64,64]])=>{ // ex. size = 64x64x2
            var net = [];
            for(var channel=0;channel<size.length;channel++){
                var ch=[];
                var count = 1;
                var countd=[];
                for(var a=0;a<size[channel].length;a++){
                    count*=size[channel][a];
                    countd.push(0);
                }
                for(var a=0;a<count;a++){
                    if(countd[0]==size[channel][0]){
                        for(var b=0;b<size[channel].length;b++){
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
            var net = [];
            for(var a=0;a<create.MathNet.length;a++){
                for(var b=0;b<create.MathNet[a].length;b++){
                    net.push(create.MathNet[a][b]);
                }
            }
            create.MathNet = net;
            return null;
        }


        create.FC = (size,actfunc="1*")=>{
            create.netID++
            var net = [];
            for(var a=0;a<size;a++){
                var eva = actfunc+"(";
                for(var b=0;b<create.MathNet.length;b++){
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
        for(var a=0;a<this.NeuralCore.MathNet.length;a++){
            console.log(this.NeuralCore.MathNet[a].length);
        }
        console.log(`The Neural Network uses approximately ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB`);
        return null;
    }

    eval(inputs=[[2,2],[2,2]]){
        console.time('total');
        console.time('declare');
        var ret = [];
        var declare="var n={};";
        var arr = [];
        for(var a=0;a<inputs.length;a++){
            for(var b=0;b<inputs[a].length;b++){
                arr.push(inputs[a][b]);
            }
        }
        for(var a=0;a<arr.length;a++){
            this.NeuralCore.parameters.inputs[a].val=arr[a];
        }
        for(var b=0;b<this.NeuralCore.parameters.inputs.length;b++){
            declare+="n."+this.NeuralCore.parameters.inputs[b].name+"="+String(this.NeuralCore.parameters.inputs[b].val)+";";
        }
        for(var b=0;b<this.NeuralCore.parameters.weights.length;b++){
            declare+="n."+this.NeuralCore.parameters.weights[b].name+"="+String(this.NeuralCore.parameters.weights[b].val)+";";
        }
        for(var b=0;b<this.NeuralCore.parameters.biases.length;b++){
            declare+="n."+this.NeuralCore.parameters.biases[b].name+"="+String(this.NeuralCore.parameters.biases[b].val)+";";
        }declare+="\n\n";

        var sigmoid = (x)=>{return 1.0/(1.0+Math.exp(-x))};
        var tanh = (x)=>{return Math.tanh(x)}
        var relu = (x)=>{return x>0?x:0}
        var leaky_relu = (x)=>{return x>0?x:x/10}
        var binary = (x)=>{return x>0.5}
        console.timeEnd('declare');
        console.time('calculation');
        for(var a=0;a<this.NeuralCore.MathNet.length;a++){
            ret.push(eval(declare+this.NeuralCore.MathNet[a]));
        }
        console.timeEnd('calculation');
        console.timeEnd('total');
        return ret;
    }

    getloss(){
        var er=0;
        for(var m=0;m<this.dataset.length;m++){
            for(var dn=0;dn<this.dataset[m].length;dn++){
                var res=this.eval(this.dataset[m][dn][0]);
                for(var cl=0;cl<res.length;cl++){
                    er+=Math.pow(res[cl]-this.dataset[m][dn][1][cl],2)}
            }
        }
        return er;
    }

    train(learning_rate=0.1,epoch=40){
        this.Istraining=true;
        for(var ep=0;ep<epoch;ep++){
            console.log(epoch,this.getloss());
        }
        this.Istraining=false;
    }
}




var TRAINING_DATA_SETS=
[
    [
        [[ [1,1] ],[1]],
        [[ [0,0] ],[1]],
        [[ [0,1] ],[0]],
        [[ [1,0] ],[0]]
    ]
];

var e = new NeuxbaneNet;
e.create((create)=>{
    create.Input([[2]]);
    create.Convert();
    create.FC(1000);
    create.FC(300);
    create.FC(1);
    return create;
});

e.dataset = TRAINING_DATA_SETS;


while(true){console.log(e.eval([[1,1]]));}
